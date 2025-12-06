type HTTPMethods =
	| 'CONNECT'
	| 'DELETE'
	| 'GET'
	| 'HEAD'
	| 'OPTIONS'
	| 'PATCH'
	| 'POST'
	| 'PUT'
	| 'TRACE';

type GetConfig = {
	fetch: typeof global.fetch;
	url: URL | string;
};

function prepareRequest(url: URL | string, method: HTTPMethods = 'GET', body?: unknown): Request {
	const headers = new Headers({
		Accept: 'application/json'
	});

	if (body != null) {
		headers.append('Content-Type', 'application/json');
	}

	return new Request(url, {
		method,
		headers,
		body: body != null ? JSON.stringify(body) : null
	});
}

/**
 * Safely extracts JSON content from a Response, returning null if the response has no content.
 * Handles both regular and gzipped responses.
 *
 * Determines content presence by:
 * 1. Checking Content-Length header (>0 means content exists), OR
 * 2. Checking for gzip encoding (compressed responses may omit Content-Length)
 *
 * Avoids errors when calling response.json() on empty responses.
 */
async function extractContent<T>(response: Response): Promise<T | null> {
	// if less than 1000 char, it has content-length
	const hasLength = Boolean(parseInt(response.headers.get('content-length') ?? '0'));
	// else its content-encoding is gzipped, see nginx.conf for details
	const isGzipped = response.headers.get('content-encoding') === 'gzip';

	const hasContent = hasLength || isGzipped;
	return hasContent ? ((await response.json()) as T) : null;
}

export async function fetchData<TResponse = unknown>({ fetch: fetchInstance, url }: GetConfig) {
	const response = await fetchInstance(prepareRequest(url));

	if (response.ok) {
		return {
			data: await extractContent<TResponse>(response),
			error: null
		};
	} else {
		return {
			data: null,
			error: await extractContent<TResponse>(response)
		};
	}
}
