import { fetchData } from '#lib/fetch/index.js';
import { redirectIfUnauthorized } from '#lib/helpers/auth.server.js';
import { buildApiUrl } from '#lib/helpers/url.js';
import type { Item } from '#lib/response/item.js';
import type { List } from '#lib/response/list.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url, params }) => {
	const [list, items] = await Promise.all([
		fetchData<List>({ fetch, url: buildApiUrl(url.origin, `list/${params.id}`) }),
		fetchData<Item[]>({ fetch, url: buildApiUrl(url.origin, `list/${params.id}/items`) }),
	]);
	redirectIfUnauthorized([list, items], url);

	return { list, items };
};
