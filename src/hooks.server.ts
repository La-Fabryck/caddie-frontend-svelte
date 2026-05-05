/**
 * SvelteKit server hooks (`hooks.server.ts`) run in the Node/server runtime and customize how
 * requests are handled and how server-side `fetch` calls behave.
 *
 * - **`handle`** — Runs once per incoming HTTP request to this app (and during prerender). You call
 *   `resolve(event)` to let SvelteKit match the route and run `load` / actions / endpoints; it returns
 *   the final `Response`. This file uses it to attach `Set-Cookie` lines that were collected during
 *   SSR API calls (see `handleFetch`).
 *
 * - **`handleFetch`** — Wraps **`event.fetch`** (and the `fetch` passed into `load`, form actions,
 *   etc. on the server). It does **not** intercept arbitrary `globalThis.fetch`. Here it rewrites
 *   same-origin `/api/*` requests to the backend, forwards cookies, and on 401 may refresh tokens and
 *   retry. Refresh responses can emit new cookies; those are buffered on `event.locals` because
 *   `handleFetch` runs *inside* `resolve`, so we merge them onto the outer response in `handle`.
 *
 * @see https://svelte.dev/docs/kit/hooks — Server hooks
 */

import { UNAUTHORIZED_STATUS_CODE } from '$lib/fetch';
import type { Handle, HandleFetch } from '@sveltejs/kit';

const allowedHeaders = ['content-type', 'content-length', 'content-encoding', 'set-cookie'];
const REFRESH_ENDPOINT_PATH = '/authentication/refresh';

/** First `name=value` segment of a Set-Cookie line (attributes after `;` ignored). */
function extractCookiePair(entry: string): { name: string; pair: string } | null {
	const pair = entry.split(';', 1)[0]?.trim() ?? '';
	const nameValueSeparatorIndex = pair.indexOf('=');
	if (nameValueSeparatorIndex < 1) return null;

	return {
		name: pair.slice(0, nameValueSeparatorIndex).trim(),
		pair
	};
}

function mergeCookieHeader(existingCookie: string | null, setCookieEntries: string[]): string {
	const cookieByName = new Map<string, string>();

	for (const cookiePart of (existingCookie ?? '').split(';')) {
		const trimmed = cookiePart.trim();
		if (trimmed.length === 0) continue;

		const separatorIndex = trimmed.indexOf('=');
		if (separatorIndex <= 0) continue;

		const name = trimmed.slice(0, separatorIndex).trim();
		cookieByName.set(name, trimmed);
	}

	for (const entry of setCookieEntries) {
		const parsed = extractCookiePair(entry);
		if (!parsed) continue;
		cookieByName.set(parsed.name, parsed.pair);
	}

	return [...cookieByName.values()].join('; ');
}

/**
 * Merge several `Set-Cookie` lines into one per cookie name; when the same name appears more than
 * once, the **last** line wins (e.g. parallel `handleFetch` refresh paths).
 */
function mergeSetCookieLinesByName(lines: string[]): string[] {
	const byName = new Map<string, string>();
	for (const line of lines) {
		const parsed = extractCookiePair(line);
		if (parsed) {
			byName.set(parsed.name, line);
		}
	}
	return [...byName.values()];
}

/**
 * SvelteKit `Handle`: observe and adjust the **document / navigation** response after the router has
 * finished (`resolve` runs loads, renders `+page` / `+layout`, and returns a `Response`).
 *
 * We forward allowed headers into serialized `fetch` data (`filterSerializedResponseHeaders`) and,
 * when SSR refreshes produced new cookies in `handleFetch`, merge those `Set-Cookie` lines onto this
 * response so the browser persists session cookies (clone + new `Response` avoids mutating responses
 * that may have immutable headers).
 */
export async function handle({
	event,
	resolve
}: Parameters<Handle>[0]): Promise<ReturnType<Handle>> {
	// `refreshedSetCookies`: per-request buffer; `handleFetch` may append after SSR refresh (see JSDoc on `App.Locals`).
	event.locals.refreshedSetCookies = [];

	const response = await resolve(event, {
		filterSerializedResponseHeaders: (name) => allowedHeaders.includes(name.toLowerCase())
	});

	// After `resolve`, forward any `Set-Cookie` lines collected during `handleFetch` to the client.
	const pending = event.locals.refreshedSetCookies;
	if (pending == null || pending.length === 0) {
		return response;
	}

	const merged = mergeSetCookieLinesByName(pending);
	const headers = new Headers(response.headers);
	for (const line of merged) {
		headers.append('set-cookie', line);
	}

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
}

const backend_url = process.env['VITE_BACKEND_URL']!;
const frontend_url = `${process.env['VITE_FRONTEND_URL']}${process.env['VITE_API_BASE_URL']}`;

/**
 * SvelteKit `HandleFetch`: intercept each **`event.fetch`** during SSR (and other server-side kit
 * `fetch` usage). Use it to rewrite URLs (e.g. browser-relative `/api` → backend origin), attach
 * cookies, or retry after auth refresh.
 *
 * Responses here are returned to **`load` / actions** as the inner fetch result; they are not always
 * the same object as the HTTP response the visitor receives. Cookie headers from a successful refresh
 * are therefore accumulated on `event.locals.refreshedSetCookies` and applied in `handle`.
 */
export async function handleFetch({
	event,
	request,
	fetch
}: Parameters<HandleFetch>[0]): Promise<ReturnType<HandleFetch>> {
	const originalUrl = request.url;
	const isApiRequest = originalUrl.includes('/api/');

	if (isApiRequest) {
		const headers = new Headers(request.headers);

		const cookie = event.request.headers.get('cookie');
		if (cookie) {
			headers.set('cookie', cookie);
		}

		const rewrittenUrl = request.url.replace(frontend_url, backend_url);

		request = new Request(rewrittenUrl, {
			method: request.method,
			headers,
			body: request.body
		});
	}

	const proxiedRequest = request;
	// Clone so `fetch` may consume the body stream without invalidating `proxiedRequest` for a later retry.
	let response = await fetch(proxiedRequest.clone());

	const isAuthRefreshRequest = originalUrl.includes('/api/authentication/refresh');
	const isAuthLoginRequest = originalUrl.includes('/api/authentication/login');
	const isUserCreationRequest = originalUrl.includes('/api/users');

	const shouldTrySsrRefresh =
		isApiRequest &&
		response.status === UNAUTHORIZED_STATUS_CODE &&
		!isAuthRefreshRequest &&
		!isAuthLoginRequest &&
		!isUserCreationRequest;

	if (!shouldTrySsrRefresh) {
		return response;
	}

	// `proxiedRequest.headers` is already a `Headers` object; `new Headers(...)` clones it so we can
	// overwrite `cookie` for refresh/retry without mutating the original request's header bag.
	const refreshHeaders = new Headers(proxiedRequest.headers);
	const refreshCookie = event.request.headers.get('cookie');
	if (refreshCookie) {
		refreshHeaders.set('cookie', refreshCookie);
	}

	const refreshRequest = new Request(`${backend_url}${REFRESH_ENDPOINT_PATH}`, {
		method: 'POST',
		headers: refreshHeaders
	});
	const refreshResponse = await fetch(refreshRequest);

	if (!refreshResponse.ok) {
		return response;
	}

	// Reuse latest cookies from refresh response for this retry request when available.
	const setCookieEntries = refreshResponse.headers.getSetCookie();
	if (setCookieEntries.length) {
		const mergedCookie = mergeCookieHeader(refreshHeaders.get('cookie'), setCookieEntries);
		refreshHeaders.set('cookie', mergedCookie);

		// Queue for `handle`: attach these to the page response so the browser stores new session cookies.
		event.locals.refreshedSetCookies ??= [];
		event.locals.refreshedSetCookies.push(...setCookieEntries);
	}

	const retriedRequest = new Request(proxiedRequest, {
		headers: refreshHeaders
	});
	response = await fetch(retriedRequest);

	return response;
}
