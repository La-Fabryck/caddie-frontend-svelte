import { fetchData } from '$lib/fetch';
import { redirectIfUnauthorized } from '$lib/helpers/auth.server';
import { buildListCollectionUrl } from '$lib/helpers/url';
import { LIST_PAGE_LIMIT, type PaginatedLists } from '$lib/response/list';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const lists = await fetchData<PaginatedLists>({
		fetch,
		url: buildListCollectionUrl(url.origin, { limit: LIST_PAGE_LIMIT, offset: 0 }),
	});
	redirectIfUnauthorized([lists], url);

	return { lists };
};
