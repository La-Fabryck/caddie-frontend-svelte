import { useQuery } from '$lib/fetch';
import type { List } from '$lib/response/list';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	return useQuery<List[]>({ url: '/api/list' });
};
