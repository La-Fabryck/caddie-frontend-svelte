import { fetchData } from '$lib/fetch';
import type { List } from '$lib/response/list';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
	return fetchData<List[]>({ fetch, url: `${url}api/list` });
};
