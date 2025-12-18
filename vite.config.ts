import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { imageOptimizationPlugin } from './scripts/vite-plugins/image-plugin';
import { versionPlugin } from './scripts/vite-plugins/version-plugin';

export default defineConfig({
	plugins: [
		versionPlugin(),
		Icons({ autoInstall: true, compiler: 'svelte', scale: 1, defaultClass: 'icon' }),
		tailwindcss(),
		sveltekit(),
		imageOptimizationPlugin()
	],
	server: {
		fs: {
			allow: ['..']
		}
	},
	build: {
		sourcemap: false,
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
				pure_funcs: ['console.log', 'console.info', 'console.debug']
			}
		},
		rollupOptions: {
			output: {
				manualChunks: {
					'svelte-vendor': ['svelte', 'svelte/internal']
				}
			}
		},
		chunkSizeWarningLimit: 600
	}
});
