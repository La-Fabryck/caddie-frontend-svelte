import { fetchData } from '$lib/fetch';
import type { List } from '$lib/response/list';
import type { PageServerLoad } from './$types';
import { buildApiUrl } from '$lib/helpers/url';

export const load: PageServerLoad = async ({ fetch, url, params }) => {
	return {
		list: fetchData<List>({ fetch, url: buildApiUrl(url.origin, `list/${params.id}`) })
	};
};
