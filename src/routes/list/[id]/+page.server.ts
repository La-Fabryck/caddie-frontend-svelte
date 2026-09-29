import { fetchData } from '$lib/fetch';
import { redirectIfUnauthorized } from '$lib/helpers/auth.server';
import { buildApiUrl } from '$lib/helpers/url';
import type { Item } from '$lib/response/item';
import type { List } from '$lib/response/list';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url, params }) => {
	const [list, items] = await Promise.all([
		fetchData<List>({ fetch, url: buildApiUrl(url.origin, `list/${params.id}`) }),
		fetchData<Item[]>({ fetch, url: buildApiUrl(url.origin, `list/${params.id}/items`) }),
	]);
	redirectIfUnauthorized([list, items], url);

	return { list, items };
};
