import { fetchData } from '$lib/fetch';
import { redirectIfUnauthorized } from '$lib/helpers/auth.server';
import { buildApiUrl } from '$lib/helpers/url';
import type { Item } from '$lib/response/item';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url, params }) => {
	const item = await fetchData<Item>({
		fetch,
		url: buildApiUrl(url.origin, `list/${params.id}/items/${params.itemId}`),
	});
	redirectIfUnauthorized([item], url);

	return { item };
};
