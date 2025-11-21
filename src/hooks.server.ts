import type { Handle, HandleFetch } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event, {
		filterSerializedResponseHeaders: (name) => name.startsWith('content')
	});

	return response;
};

export const handleFetch: HandleFetch = async ({ request, fetch }) => {
	if (request.url.includes('/api/')) {
		// clone the original request, but change the URL
		request = new Request(
			request.url.replace(
				`${process.env['VITE_FRONTEND_URL']}${process.env['VITE_API_BASE_URL']}}`,
				process.env['VITE_BACKEND_URL']!
			),
			request
		);
	}

	return fetch(request);
};
