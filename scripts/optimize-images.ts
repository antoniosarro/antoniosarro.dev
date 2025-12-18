import { ImageOptimizer } from './build/image-optimizer';
import { logger } from './build/utils';

const config = {
	inputDir: 'assets/images',
	outputDir: 'static/images',
	formats: ['avif', 'webp'] as const,
	qualities: {
		avif: 75,
		webp: 80
	},
	maxWidth: 1920,
	generateOriginalFallback: true
};

async function main() {
	try {
		const optimizer = new ImageOptimizer(config);
		await optimizer.optimizeImages();
		logger.success('✅ Image optimization complete!');
		process.exit(0);
	} catch (error) {
		logger.error(
			`Optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
		);
		process.exit(1);
	}
}

main();
