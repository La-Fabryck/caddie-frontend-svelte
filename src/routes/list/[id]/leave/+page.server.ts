import { fetchData } from '#lib/fetch/index.js';
import { redirectIfUnauthorized } from '#lib/helpers/auth.server.js';
import { buildApiUrl } from '#lib/helpers/url.js';
import type { List } from '#lib/response/list.js';
import type { Subscriber } from '#lib/response/subscriber.js';
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
