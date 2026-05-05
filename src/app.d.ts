// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			/**
			 * **SSR auth: cookies to forward to the browser after a successful token refresh.**
			 *
			 * - **When set:** `handleFetch` in `src/hooks.server.ts`, after a proxied API call returns
			 *   `401`, the refresh request to the backend succeeds, and the refresh response includes
			 *   `Set-Cookie` (e.g. new access/refresh session cookies). Each full header line is stored
			 *   here (as returned by `Headers.prototype.getSetCookie()`).
			 * - **When read:** `handle` in the same file, *after* `await resolve(event, …)` completes.
			 *   Those lines are deduped by cookie name, then attached to the final response with
			 *   `Set-Cookie` so the client’s cookie jar updates (see `filterSerializedResponseHeaders` and
			 *   the `set-cookie` allowlist there).
			 * - **Scope:** One SvelteKit request. `handle` resets this to `[]` at the start of each
			 *   request; it is not shared across users or parallel requests.
			 * - **Why it exists:** `event.cookies.set` cannot be used from `handleFetch` at the right
			 *   time; collecting here and applying in `handle` avoids that and keeps browser cookies in
			 *   sync with SSR refresh+retry.
			 */
			refreshedSetCookies?: string[];
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
