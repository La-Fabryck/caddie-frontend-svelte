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

type MutateConfig = GetConfig & {
	method: Extract<HTTPMethods, 'PATCH' | 'POST' | 'PUT'>;
	body: unknown;
};

export const UNAUTHORIZED_STATUS_CODE = 401;
export const BAD_REQUEST_STATUS_CODE = 400;

const REFRESH_ENDPOINT_PATH = '/api/authentication/refresh';
const NON_REFRESHABLE_PATHS = new Set([
	'/api/authentication/login',
	'/api/authentication/refresh',
	'/api/users'
]);

let refreshPromise: Promise<void> | null = null;

/**
 * Builds a Request with JSON Accept and optional body.
 * Mirrors prepareRequest from caddie-frontend-preact/src/hooks/use-fetch.ts (no cache/signals).
 */
function prepareRequest(url: URL | string, method: HTTPMethods = 'GET', body?: unknown): Request {
	const headers = new Headers({
		Accept: 'application/json',
		'Content-Type': 'application/json'
	});

	if (body == null) {
		headers.delete('Content-Type');
	}

	return new Request(url, {
		method,
		headers,
		body: body != null ? JSON.stringify(body) : null
	});
}

function isBrowserRuntime(): boolean {
	return typeof window !== 'undefined';
}

function shouldAttemptRefresh(request: Request, status: number): boolean {
	// Keep single-flight refresh browser-only: module-level shared state is safe for one client runtime,
	// but would be unsafe for SSR where requests from different users can run concurrently on the server.
	if (!isBrowserRuntime() || status !== 401) {
		return false;
	}

	const requestPath = new URL(request.url, window.location.origin).pathname;
	return requestPath.startsWith('/api/') && !NON_REFRESHABLE_PATHS.has(requestPath);
}

async function runRefresh(fetchInstance: typeof global.fetch): Promise<void> {
	const refreshResponse = await fetchInstance(
		new Request(REFRESH_ENDPOINT_PATH, { method: 'POST' })
	);

	if (!refreshResponse.ok) {
		throw new Error('REFRESH_FAILED');
	}
}

async function requestWithSingleFlightRefresh(
	fetchInstance: typeof global.fetch,
	request: Request
): Promise<Response> {
	const response = await fetchInstance(request.clone());

	if (!shouldAttemptRefresh(request, response.status)) {
		return response;
	}

	if (refreshPromise == null) {
		refreshPromise = runRefresh(fetchInstance).finally(() => {
			refreshPromise = null;
		});
	}

	try {
		await refreshPromise;
	} catch {
		return response;
	}

	// Retry only once after successful refresh.
	const retriedResponse = await fetchInstance(request.clone());
	return retriedResponse;
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
function hasContent(response: Response): boolean {
	// if less than 1000 char, it has content-length
	const hasLength = Boolean(parseInt(response.headers.get('content-length') ?? '0'));
	// else its content-encoding is gzipped, see nginx.conf for details
	const isGzipped = response.headers.get('content-encoding') === 'gzip';

	return hasLength || isGzipped;
}

async function extractContent<T>(response: Response): Promise<T | null> {
	return hasContent(response) ? ((await response.json()) as T) : null;
}

export async function fetchData<TResponse = unknown, TError = unknown>({
	fetch: fetchInstance,
	url
}: GetConfig) {
	const response = await requestWithSingleFlightRefresh(fetchInstance, prepareRequest(url));

	if (response.ok) {
		return {
			data: (await response.json()) as TResponse,
			error: null
		};
	} else {
		return {
			data: null,
			error: await extractContent<TError>(response)
		};
	}
}

export async function mutateData<TResponse = unknown, TError = unknown>({
	fetch: fetchInstance,
	url,
	method,
	body
}: MutateConfig) {
	const response = await requestWithSingleFlightRefresh(
		fetchInstance,
		prepareRequest(url, method, body)
	);

	if (response.ok) {
		return {
			status: response.status,
			data: await extractContent<TResponse>(response),
			error: null
		};
	} else {
		const error = ((await extractContent<TError>(response)) ?? {
			root: [{ message: 'REQUEST_FAILED' }]
		}) as TError;
		return {
			status: response.status,
			data: null,
			error
		};
	}
}

export async function deleteData<TResponse = unknown, TError = unknown>({
	fetch: fetchInstance,
	url
}: GetConfig) {
	const response = await requestWithSingleFlightRefresh(
		fetchInstance,
		prepareRequest(url, 'DELETE')
	);

	if (response.ok) {
		return {
			status: response.status,
			data: await extractContent<TResponse>(response),
			error: null
		};
	} else {
		const error = ((await extractContent<TError>(response)) ?? {
			root: [{ message: 'REQUEST_FAILED' }]
		}) as TError;
		return {
			status: response.status,
			data: null,
			error
		};
	}
}
