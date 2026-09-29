import type { Pathname } from '$app/types';

export const LOGIN_REDIRECT_PARAM = 'redirect';

/**
 * Build an URL that prefixes the api route
 *
 * @param route the api route you want to call minus "/api"
 * @returns URL
 */
export function buildApiUrl(origin: string, pathname: string): URL {
	const url = new URL(origin);
	url.pathname = `/api/${pathname}`;
	return url;
}

export function buildListCollectionUrl(
	origin: string,
	{ limit, offset }: { limit: number; offset: number },
): URL {
	const url = buildApiUrl(origin, 'list');
	url.searchParams.set('limit', String(limit));
	url.searchParams.set('offset', String(offset));
	return url;
}

/**
 * Sanitize `?redirect=` from the URL.
 * Returns a same-app pathname, or `''` when there is nothing useful to restore
 * (missing/invalid, home `/`, or auth pages — avoids open redirects and
 * login ↔ create-account loops).
 *
 * Caveat: only the pathname is kept. Search and hash are dropped on purpose for
 * now (e.g. `/list/x?tab=1` → `/list/x`). Restore query/hash later if product needs it.
 */
function safeLoginRedirectPath(raw: string | null): string {
	if (raw == null || raw.startsWith('//') || !raw.startsWith('/')) {
		return '';
	}

	const pathname = raw.split(/[?#]/)[0] ?? '';
	if (pathname === '/' || pathname === '/login' || pathname === '/create-account') {
		return '';
	}

	return pathname;
}

/**
 * Read and sanitize `?redirect=`; always a navigable path (`/` when nothing useful).
 * Cast: Kit's `Pathname` is a closed route union; a sanitized string can't prove membership.
 */
export function loginReturnPath(url: URL): Pathname {
	return (safeLoginRedirectPath(url.searchParams.get(LOGIN_REDIRECT_PARAM)) || '/') as Pathname;
}

/** `?redirect=…` when there is a destination, otherwise `''`. */
export function buildLoginRedirectSearch(returnPath: string): string {
	const safe = safeLoginRedirectPath(returnPath);
	if (safe === '') {
		return '';
	}
	return `?${LOGIN_REDIRECT_PARAM}=${encodeURIComponent(safe)}`;
}

/** Full `/login` href for SSR `redirect()` (path + optional redirect query). */
export function buildLoginHref(returnPath: string): string {
	return `/login${buildLoginRedirectSearch(returnPath)}`;
}
