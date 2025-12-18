import path from 'path';
import fs from 'fs';
import { glob } from 'glob';
import {
	type FontFamily,
	type OptimizationResult,
	type FontStats,
	PATHS,
	FONT_FAMILIES,
	logger,
	fileUtils,
	execUtils
} from './utils';

export class FontOptimizer {
	constructor(
		private readonly fontsDir: string = PATHS.fonts,
		private readonly buildDir: string = PATHS.build,
		private readonly optimizedDir: string = PATHS.optimized
	) {
		this.checkPyftsubsetInstalled();
	}

	private checkPyftsubsetInstalled(): void {
		try {
			execUtils.executeQuiet('pyftsubset --help');
		} catch {
			throw new Error(
				'pyftsubset not found. Install it with: pip3 install fonttools brotli zopfli'
			);
		}
	}

	async optimizeFonts(fontFamilies: FontFamily[] = FONT_FAMILIES): Promise<FontStats> {
		logger.header('🔤 Starting font optimization with pyftsubset...');

		fileUtils.ensureDirectoryExists(this.optimizedDir);

		const unicodes = await this.extractUnicodes();
		const allResults: OptimizationResult[] = [];

		for (const fontFamily of fontFamilies) {
			logger.subheader(`📁 Processing ${fontFamily.name} fonts...`);

			const results = await this.optimizeFontFamily(fontFamily, unicodes);
			allResults.push(...results);
		}

		return this.calculateStats(allResults);
	}

	private async extractUnicodes(): Promise<string> {
		logger.info('Extracting characters from HTML files...');

		const htmlFiles = await glob(`${this.buildDir}/**/*.html`, {
			nodir: true,
			absolute: true
		});

		if (htmlFiles.length === 0) {
			throw new Error('No HTML files found in build directory. Run `pnpm run build` first.');
		}

		logger.info(`Analyzing ${htmlFiles.length} HTML files`);

		const allChars = new Set<string>();

		for (const file of htmlFiles) {
			const content = fs.readFileSync(file, 'utf-8');
			const textContent = content
				.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
				.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
				.replace(/<[^>]+>/g, ' ')
				.replace(/&nbsp;/g, ' ')
				.replace(/&amp;/g, '&')
				.replace(/&lt;/g, '<')
				.replace(/&gt;/g, '>')
				.replace(/&quot;/g, '"')
				.replace(/&#039;/g, "'");

			for (const char of textContent) {
				allChars.add(char);
			}
		}

		const unicodes = Array.from(allChars)
			.map((char) => `U+${char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}`)
			.join(',');

		logger.success(`Extracted ${allChars.size} unique characters`);

		return unicodes;
	}

	private async optimizeFontFamily(
		fontFamily: FontFamily,
		unicodes: string
	): Promise<OptimizationResult[]> {
		const fontDir = path.join(this.fontsDir, fontFamily.name);
		const optimizedDir = path.join(this.optimizedDir, fontFamily.name);

		fileUtils.ensureDirectoryExists(optimizedDir);

		const results: OptimizationResult[] = [];

		for (const fontFile of fontFamily.files) {
			const result = await this.optimizeFont(fontFile, fontDir, optimizedDir, unicodes);
			results.push(result);
			this.logResult(result);
		}

		return results;
	}

	private async optimizeFont(
		fontFile: string,
		inputDir: string,
		outputDir: string,
		unicodes: string
	): Promise<OptimizationResult> {
		const inputPath = path.join(inputDir, fontFile);
		const outputPath = path.join(outputDir, fontFile);

		try {
			logger.info(`Optimizing ${fontFile}...`);

			const originalSize = fileUtils.getFileSize(inputPath);

			execUtils.execute(
				`pyftsubset "${inputPath}" \
					--output-file="${outputPath}" \
					--flavor=woff2 \
					--unicodes="${unicodes}" \
					--layout-features="*" \
					--no-hinting \
					--desubroutinize`
			);

			const optimizedSize = fileUtils.getFileSize(outputPath);
			const reduction = fileUtils.calculateReduction(originalSize, optimizedSize);

			return {
				file: fontFile,
				originalSize,
				optimizedSize,
				reduction,
				success: true
			};
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			logger.error(`Failed to optimize ${fontFile}: ${errorMessage}`);

			return {
				file: fontFile,
				originalSize: fileUtils.getFileSize(inputPath),
				optimizedSize: 0,
				reduction: 0,
				success: false,
				error: errorMessage
			};
		}
	}

	private logResult(result: OptimizationResult): void {
		if (result.success) {
			const originalKB = fileUtils.formatBytes(result.originalSize);
			const optimizedKB = fileUtils.formatBytes(result.optimizedSize);
			logger.stats(result.file, originalKB, optimizedKB, result.reduction);
		}
	}

	private calculateStats(results: OptimizationResult[]): FontStats {
		const successfulResults = results.filter((r) => r.success);

		const totalOriginalSize = successfulResults.reduce((sum, r) => sum + r.originalSize, 0);
		const totalOptimizedSize = successfulResults.reduce((sum, r) => sum + r.optimizedSize, 0);
		const totalReduction = fileUtils.calculateReduction(totalOriginalSize, totalOptimizedSize);

		return {
			totalOriginalSize,
			totalOptimizedSize,
			totalReduction,
			results
		};
	}

	printSummary(stats: FontStats): void {
		logger.header('📊 Optimization Summary');

		const successCount = stats.results.filter((r) => r.success).length;
		const failCount = stats.results.filter((r) => !r.success).length;

		logger.info(`Total fonts processed: ${stats.results.length}`);
		logger.success(`Successfully optimized: ${successCount}`);

		if (failCount > 0) {
			logger.error(`Failed: ${failCount}`);
		}

		logger.info(
			`Total size: ${fileUtils.formatBytes(stats.totalOriginalSize)}KB → ${fileUtils.formatBytes(stats.totalOptimizedSize)}KB`
		);
		logger.success(`Overall reduction: ${stats.totalReduction}%`);

		console.log('\n');
	}
}
