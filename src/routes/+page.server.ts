import { fetchData } from '$lib/fetch';
import { buildListCollectionUrl } from '$lib/helpers/url';
import { LIST_PAGE_LIMIT, type PaginatedLists } from '$lib/response/list';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	return {
		lists: fetchData<PaginatedLists>({
			fetch,
			url: buildListCollectionUrl(url.origin, { limit: LIST_PAGE_LIMIT, offset: 0 }),
		}),
	};
};
