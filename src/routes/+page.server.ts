import { fetchData } from '$lib/fetch';
import { buildApiUrl } from '$lib/helpers/url';
import type { List } from '$lib/response/list';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	return {
		lists: fetchData<List[]>({ fetch, url: buildApiUrl(url.origin, 'list') }),
	};
};
