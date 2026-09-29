import { fetchData } from '$lib/fetch';
import { redirectIfUnauthorized } from '$lib/helpers/auth.server';
import { buildApiUrl } from '$lib/helpers/url';
import type { List } from '$lib/response/list';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url, params }) => {
	const list = await fetchData<List>({
		fetch,
		url: buildApiUrl(url.origin, `list/${params.id}`),
	});
	redirectIfUnauthorized([list], url);

	return { list };
};
