import type { Plugin } from 'vite';
import { ImageOptimizer } from '../build/image-optimizer';
import { watch, type FSWatcher } from 'chokidar';

export function imageOptimizationPlugin(): Plugin {
	let watcher: FSWatcher | null = null;

	return {
		name: 'vite-image-optimization',

		async buildStart() {
			const optimizer = new ImageOptimizer();
			await optimizer.optimizeImages();
		},

		configureServer(server) {
			watcher = watch('assets/images/**/*.{jpg,jpeg,png,webp,gif,avif}', {
				ignoreInitial: true
			});

			watcher.on('add', async (path) => {
				console.log(`New image detected: ${path}`);
				const optimizer = new ImageOptimizer();
				await optimizer.optimizeImages();
				server.ws.send({ type: 'full-reload' });
			});

			watcher.on('change', async (path) => {
				console.log(`Image changed: ${path}`);
				const optimizer = new ImageOptimizer();
				await optimizer.optimizeImages();
				server.ws.send({ type: 'full-reload' });
			});
		},

		closeBundle() {
			watcher?.close();
		}
	};
}
