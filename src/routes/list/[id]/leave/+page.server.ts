import { fetchData } from '$lib/fetch';
import { redirectIfUnauthorized } from '$lib/helpers/auth.server';
import { buildApiUrl } from '$lib/helpers/url';
import type { List } from '$lib/response/list';
import type { Subscriber } from '$lib/response/subscriber';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url, params }) => {
	const [list, subscribers] = await Promise.all([
		fetchData<List>({
			fetch,
			url: buildApiUrl(url.origin, `list/${params.id}`),
		}),
		fetchData<Subscriber[]>({
			fetch,
			url: buildApiUrl(url.origin, 'subscribers'),
		}),
	]);
	redirectIfUnauthorized([list, subscribers], url);

	const subscriptionId =
		subscribers.data?.find((subscriber) => subscriber.listId === params.id)?.id ?? null;

	return { list, subscriptionId };
};
