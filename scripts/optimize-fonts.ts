import { FontOptimizer } from './build/font-optimizer';
import { fileUtils, FONT_FAMILIES, logger, PATHS } from './build/utils';

async function main(): Promise<void> {
	try {
		if (!fileUtils.fileExists(PATHS.build)) {
			logger.error(
				'Build directory not found. Please run `pnpm run build` first.'
			);
			process.exit(1);
		}

		const optimizer = new FontOptimizer();
		const stats = await optimizer.optimizeFonts(FONT_FAMILIES);

		optimizer.printSummary(stats);

		logger.success('✅ Font optimization complete!');
		process.exit(0);
	} catch (error) {
		logger.error(
			`Optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
		);
		process.exit(1);
	}
}

await main();
