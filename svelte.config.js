import { mdsvex } from '@huntabyte/mdsvex';
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

import { mdsvexOptions } from './mdsvex.config.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [mdsvex(mdsvexOptions), vitePreprocess()],

	kit: {
		adapter: adapter({
			precompress: true
		}),
		alias: {
			$components: 'src/components',
			$data: 'src/data',
			$mdx: 'src/components/mdx',
			$shared: 'src/components/shared',
			$styles: 'src/styles',
			$types: 'src/lib/types',
			$utils: 'src/lib/utils'
		}
	},
	extensions: ['.svelte', '.mdx']
};

export default config;
