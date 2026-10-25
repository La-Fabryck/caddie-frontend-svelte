import { fetchData } from '#lib/fetch/index.js';
import { redirectIfUnauthorized } from '#lib/helpers/auth.server.js';
import { buildApiUrl } from '#lib/helpers/url.js';
import type { List } from '#lib/response/list.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url, params }) => {
	const list = await fetchData<List>({
		fetch,
		url: buildApiUrl(url.origin, `list/${params.id}`),
	});
	redirectIfUnauthorized([list], url);

	return { list };
};
