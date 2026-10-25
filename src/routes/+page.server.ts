import { fetchData } from '#lib/fetch/index.js';
import { redirectIfUnauthorized } from '#lib/helpers/auth.server.js';
import { buildListCollectionUrl } from '#lib/helpers/url.js';
import { LIST_PAGE_LIMIT, type PaginatedLists } from '#lib/response/list.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const lists = await fetchData<PaginatedLists>({
		fetch,
		url: buildListCollectionUrl(url.origin, { limit: LIST_PAGE_LIMIT, offset: 0 }),
	});
	redirectIfUnauthorized([lists], url);

	return { lists };
};
