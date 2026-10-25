import { defineEnvVars } from '@sveltejs/kit/env';

function required(name: string) {
	return (value: string | undefined) => {
		if (value == null || value.length === 0) {
			throw new Error(
				`${name} is required. Copy .env.sample to .env (dev) or set docker/app/prod/.env (prod).`,
			);
		}
		return value;
	};
}

export const variables = defineEnvVars({
	VITE_BACKEND_URL: { schema: required('VITE_BACKEND_URL') },
	VITE_FRONTEND_URL: { schema: required('VITE_FRONTEND_URL') },
	VITE_API_BASE_URL: { schema: required('VITE_API_BASE_URL') },
});
