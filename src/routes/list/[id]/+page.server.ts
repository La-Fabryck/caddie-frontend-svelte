import { fetchData } from '$lib/fetch';
import { buildApiUrl } from '$lib/helpers/url';
import type { Item } from '$lib/response/item';
import type { List } from '$lib/response/list';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url, params }) => {
	return {
		list: fetchData<List>({ fetch, url: buildApiUrl(url.origin, `list/${params.id}`) }),
		items: fetchData<Item[]>({ fetch, url: buildApiUrl(url.origin, `list/${params.id}/items`) }),
	};
};
