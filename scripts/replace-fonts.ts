import { PATHS, logger, fileUtils } from './build/utils';

function main(): void {
	try {
		logger.header('🔄 Replacing fonts with optimized versions...');

		logger.info('Removing original fonts...');
		fileUtils.removeDirectory(PATHS.buildFonts);

		logger.info('Copying optimized fonts...');
		fileUtils.copyDirectory(PATHS.optimized, PATHS.buildFonts);

		logger.success('✅ Font replacement complete!');
		process.exit(0);
	} catch (error) {
		logger.error(
			`Font replacement failed: ${error instanceof Error ? error.message : 'Unknown error'}`
		);
		process.exit(1);
	}
}

main();
