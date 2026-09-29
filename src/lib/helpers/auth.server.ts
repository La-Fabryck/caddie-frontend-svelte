import { UNAUTHORIZED_STATUS_CODE } from '$lib/fetch';
import { buildLoginHref } from '$lib/helpers/url';
import { redirect } from '@sveltejs/kit';

/** HTTP 303 See Other — client must follow with GET (right for send-to-login). */
const SEE_OTHER_STATUS_CODE = 303;

/** If any fetch result is 401, redirect to login preserving the current page path. */
export function redirectIfUnauthorized(results: Array<{ status: number }>, pageUrl: URL): void {
	if (results.some((result) => result.status === UNAUTHORIZED_STATUS_CODE)) {
		redirect(SEE_OTHER_STATUS_CODE, buildLoginHref(pageUrl.pathname));
	}
}
