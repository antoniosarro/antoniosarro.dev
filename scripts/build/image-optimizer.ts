import { logger } from './utils';

import { existsSync, mkdirSync } from 'fs';
import fs from 'fs/promises';
import { glob } from 'glob';
import path from 'path';
import sharp from 'sharp';

interface ImageOptimizationConfig {
	inputDir: string;
	outputDir: string;
	formats: ('webp' | 'avif')[];
	qualities: Record<'webp' | 'avif', number>;
	maxWidth: number;
	generateOriginalFallback: boolean;
}

interface ImageMetadata {
	width: number;
	height: number;
	aspectRatio: number;
	formats: string[];
}

export interface ImageMetadataMap {
	[webPath: string]: ImageMetadata;
}

const DEFAULT_CONFIG: ImageOptimizationConfig = {
	inputDir: 'assets/images',
	outputDir: 'static/images',
	formats: ['avif', 'webp'],
	qualities: {
		avif: 75,
		webp: 80
	},
	maxWidth: 1920,
	generateOriginalFallback: true
};

export class ImageOptimizer {
	private config: ImageOptimizationConfig;
	private metadata: ImageMetadataMap = {};
	private processedCount = 0;
	private skippedCount = 0;

	constructor(config: Partial<ImageOptimizationConfig> = {}) {
		this.config = { ...DEFAULT_CONFIG, ...config };
	}

	async optimizeImages(): Promise<ImageMetadataMap> {
		logger.header('🖼️ Starting image optimization...');

		if (!existsSync(this.config.outputDir)) {
			mkdirSync(this.config.outputDir, { recursive: true });
		}

		const imageFiles = await glob(
			`${this.config.inputDir}/**/*.{jpg,jpeg,png,webp,gif,avif}`,
			{
				nodir: true,
				absolute: true
			}
		);

		logger.info(`Found ${imageFiles.length} images to process`);

		const CONCURRENCY = 4;
		for (let i = 0; i < imageFiles.length; i += CONCURRENCY) {
			const batch = imageFiles.slice(i, i + CONCURRENCY);
			await Promise.all(batch.map((img) => this.processImage(img)));
		}

		const metadataPath = path.join(
			this.config.outputDir,
			'images-metadata.json'
		);
		await fs.writeFile(metadataPath, JSON.stringify(this.metadata, null, 2));

		logger.header('📊 Optimization Summary');
		logger.success(`Processed: ${this.processedCount} images`);
		logger.info(`Skipped (cached): ${this.skippedCount} images`);
		logger.success(`Metadata saved to: ${metadataPath}`);

		return this.metadata;
	}

	private async processImage(imagePath: string): Promise<void> {
		const relativePath = path.relative(this.config.inputDir, imagePath);
		const parsedPath = path.parse(relativePath);
		const outDir = path.join(this.config.outputDir, parsedPath.dir);

		if (!existsSync(outDir)) {
			mkdirSync(outDir, { recursive: true });
		}

		const webPath = `/images/${parsedPath.dir ? parsedPath.dir + '/' : ''}${parsedPath.name}`;

		try {
			const image = sharp(imagePath);
			const originalMetadata = await image.metadata();

			if (!originalMetadata.width || !originalMetadata.height) {
				logger.warn(`Skipping ${relativePath}: Could not read dimensions`);
				return;
			}

			let width = originalMetadata.width;
			let height = originalMetadata.height;

			if (width > this.config.maxWidth) {
				const ratio = this.config.maxWidth / width;
				width = this.config.maxWidth;
				height = Math.round(height * ratio);
			}

			const shouldRegenerate = await this.shouldRegenerate(
				imagePath,
				outDir,
				parsedPath.name
			);

			if (!shouldRegenerate) {
				this.metadata[webPath] = {
					width,
					height,
					aspectRatio: width / height,
					formats: this.config.formats
				};
				this.skippedCount++;
				return;
			}

			const resizedImage =
				width !== originalMetadata.width
					? image.resize(width, height, { withoutEnlargement: true })
					: image;

			const generatedFormats: string[] = [];

			for (const format of this.config.formats) {
				const outputPath = path.join(outDir, `${parsedPath.name}.${format}`);

				await resizedImage
					.clone()
					[format]({ quality: this.config.qualities[format] })
					.toFile(outputPath);

				generatedFormats.push(format);
			}

			if (this.config.generateOriginalFallback) {
				const fallbackExt = parsedPath.ext.toLowerCase();
				const fallbackPath = path.join(
					outDir,
					`${parsedPath.name}${fallbackExt}`
				);

				if (fallbackExt === '.jpg' || fallbackExt === '.jpeg') {
					await resizedImage.clone().jpeg({ quality: 85 }).toFile(fallbackPath);
				} else if (fallbackExt === '.png') {
					await resizedImage
						.clone()
						.png({ compressionLevel: 9 })
						.toFile(fallbackPath);
				}
			}

			this.metadata[webPath] = {
				width,
				height,
				aspectRatio: width / height,
				formats: generatedFormats
			};

			this.processedCount++;
			logger.success(
				`Optimized: ${relativePath} (${generatedFormats.join(', ')})`
			);
		} catch (error) {
			logger.error(`Failed to process ${relativePath}: ${error}`);
		}
	}

	private async shouldRegenerate(
		sourcePath: string,
		outDir: string,
		baseName: string
	): Promise<boolean> {
		try {
			const sourceStats = await fs.stat(sourcePath);

			for (const format of this.config.formats) {
				const outputPath = path.join(outDir, `${baseName}.${format}`);

				if (!existsSync(outputPath)) {
					return true;
				}

				const outputStats = await fs.stat(outputPath);
				if (sourceStats.mtime > outputStats.mtime) {
					return true;
				}
			}

			return false;
		} catch {
			return true;
		}
	}
}
