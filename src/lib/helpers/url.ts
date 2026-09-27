/**
 * Build an URL that prefixes the api route
 *
 * @param route the api route you want to call minus "/api"
 * @returns URL
 */
export function buildApiUrl(origin: string, pathname: string): URL {
	const url = new URL(origin);
	url.pathname = `/api/${pathname}`;
	return url;
}

export function buildListCollectionUrl(
	origin: string,
	{ limit, offset }: { limit: number; offset: number },
): URL {
	const url = buildApiUrl(origin, 'list');
	url.searchParams.set('limit', String(limit));
	url.searchParams.set('offset', String(offset));
	return url;
}
