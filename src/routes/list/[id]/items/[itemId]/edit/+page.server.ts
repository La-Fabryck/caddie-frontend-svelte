import { fetchData } from '#lib/fetch/index.js';
import { redirectIfUnauthorized } from '#lib/helpers/auth.server.js';
import { buildApiUrl } from '#lib/helpers/url.js';
import type { Item } from '#lib/response/item.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url, params }) => {
	const item = await fetchData<Item>({
		fetch,
		url: buildApiUrl(url.origin, `list/${params.id}/items/${params.itemId}`),
	});
	redirectIfUnauthorized([item], url);

	return { item };
};
