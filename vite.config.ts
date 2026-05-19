import { sveltekit } from '@sveltejs/kit/vite';
/* eslint-disable no-console */
import tailwindcss from '@tailwindcss/vite';
import { playwright } from '@vitest/browser-playwright';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const backendUrl = env['VITE_BACKEND_URL'];
	if (backendUrl == null || backendUrl === '') {
		throw new Error(
			'VITE_BACKEND_URL is required. Copy .env.sample to .env and set VITE_BACKEND_URL (e.g. http://localhost:3001).',
		);
	}

	return {
		plugins: [tailwindcss(), sveltekit()],
		server: {
			host: '0.0.0.0',
			proxy: {
				'/api': {
					target: backendUrl,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ''),
					configure: (proxy) => {
						proxy.on('error', (err) => {
							console.log('proxy error', err);
						});
						proxy.on('proxyReq', (_proxyReq, req) => {
							console.log('Sending Request to the Target:', req.method, req.url);
						});
						proxy.on('proxyRes', (proxyRes, req) => {
							console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
						});
					},
				},
			},
		},
		test: {
			expect: { requireAssertions: true },
			projects: [
				{
					extends: './vite.config.ts',
					test: {
						name: 'client',
						browser: {
							enabled: true,
							provider: playwright(),
							instances: [{ browser: 'chromium', headless: true }],
						},
						include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
						exclude: ['src/lib/server/**'],
					},
				},
			],
		},
	};
});
