import type { Handle, HandleFetch } from '@sveltejs/kit';

const allowedHeaders = ['content-type', 'content-length', 'content-encoding'];

export async function handle({
	event,
	resolve
}: Parameters<Handle>[0]): Promise<ReturnType<Handle>> {
	const response = await resolve(event, {
		filterSerializedResponseHeaders: (name) => allowedHeaders.includes(name.toLowerCase())
	});

	return response;
}

const backend_url = process.env['VITE_BACKEND_URL']!;
const frontend_url = `${process.env['VITE_FRONTEND_URL']}${process.env['VITE_API_BASE_URL']}}`;

export async function handleFetch({
	request,
	fetch
}: Parameters<HandleFetch>[0]): Promise<ReturnType<HandleFetch>> {
	console.log(request.headers);
	if (request.url.includes('/api/')) {
		// clone the original request, but change the URL
		request = new Request(request.url.replace(frontend_url, backend_url), request);
	}

	return fetch(request);
}
