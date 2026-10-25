import { fetchData } from '#lib/fetch/index.js';
import { redirectIfUnauthorized } from '#lib/helpers/auth.server.js';
import { buildApiUrl } from '#lib/helpers/url.js';
import type { Subscriber } from '#lib/response/subscriber.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	// Auth probe: join requires login; redirect preserves /join/[token] pathname.
	const subscribers = await fetchData<Subscriber[]>({
		fetch,
		url: buildApiUrl(url.origin, 'subscribers'),
	});
	redirectIfUnauthorized([subscribers], url);

	return {};
};
