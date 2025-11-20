import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter()
		// alias: {
		// 	// an alias ending /* will only match
		// 	// the contents of a directory, not the directory itself
		// 	// '$components/*': 'src/components/*'
		// },
	},
	extensions: ['.svelte']
};

export default config;
