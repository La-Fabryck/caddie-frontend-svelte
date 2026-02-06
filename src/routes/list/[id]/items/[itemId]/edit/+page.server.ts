import { fetchData } from '$lib/fetch';
import type { Item } from '$lib/response/item';
import type { PageServerLoad } from './$types';
import { buildApiUrl } from '$lib/helpers/url';

export const load: PageServerLoad = async ({ fetch, url, params }) => {
	return {
		item: fetchData<Item>({
			fetch,
			url: buildApiUrl(url.origin, `list/${params.id}/items/${params.itemId}`)
		})
	};
};
