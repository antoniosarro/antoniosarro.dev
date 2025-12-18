import type { Plugin } from 'unified';
import type { Root, Element } from 'hast';
import { visit } from 'unist-util-visit';
import fs from 'fs';
import path from 'path';

interface ImageMetadata {
	width: number;
	height: number;
	aspectRatio: number;
	formats: string[];
}

interface ImageMetadataMap {
	[webPath: string]: ImageMetadata;
}

// Load metadata at module level (cached)
let imageMetadataCache: ImageMetadataMap | null = null;

function loadImageMetadata(): ImageMetadataMap {
	if (imageMetadataCache) {
		return imageMetadataCache;
	}

	try {
		const metaPath = path.resolve('static/images/images-metadata.json');
		if (fs.existsSync(metaPath)) {
			imageMetadataCache = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
			return imageMetadataCache!;
		}
	} catch (e) {
		console.warn('⚠️ Could not load image metadata. Run pnpm run optimize:images first.');
	}

	return {};
}

/**
 * Rehype plugin to transform <img> tags into responsive <picture> elements
 * with multiple modern formats (AVIF, WebP) and proper fallbacks
 */
export function rehypeOptimizeImages(): Plugin<[], Root> {
	const metadata = loadImageMetadata();

	return (tree) => {
		visit(tree, 'element', (node: Element, index, parent) => {
			if (node.tagName !== 'img' || !parent || typeof index !== 'number') {
				return;
			}

			const src = node.properties?.src as string;
			if (!src || !src.startsWith('/images/')) {
				return;
			}

			// Extract base path without extension
			const basePath = src.replace(/\.[^/.]+$/, '');
			const originalExt = path.extname(src);

			// Look up metadata
			const meta = metadata[basePath];

			// Build source elements for modern formats
			const sources: Element[] = [];

			if (meta?.formats) {
				// Add sources in preference order (AVIF first, then WebP)
				if (meta.formats.includes('avif')) {
					sources.push({
						type: 'element',
						tagName: 'source',
						properties: {
							srcset: `${basePath}.avif`,
							type: 'image/avif'
						},
						children: []
					});
				}

				if (meta.formats.includes('webp')) {
					sources.push({
						type: 'element',
						tagName: 'source',
						properties: {
							srcset: `${basePath}.webp`,
							type: 'image/webp'
						},
						children: []
					});
				}
			}

			// Configure the fallback img element
			const imgProps: Record<string, unknown> = {
				...node.properties,
				src: `${basePath}${originalExt}`, // Use original extension for fallback
				loading: 'lazy',
				decoding: 'async'
			};

			// Add dimensions to prevent CLS
			if (meta) {
				imgProps.width = meta.width;
				imgProps.height = meta.height;
				imgProps.style = `max-width: 100%; height: auto; aspect-ratio: ${meta.width} / ${meta.height};`;
			} else {
				imgProps.style = 'max-width: 100%; height: auto;';
			}

			// Create the img element
			const imgElement: Element = {
				type: 'element',
				tagName: 'img',
				properties: imgProps,
				children: []
			};

			// Wrap in <picture> if we have modern format sources
			if (sources.length > 0) {
				const picture: Element = {
					type: 'element',
					tagName: 'picture',
					properties: {
						class: 'optimized-image'
					},
					children: [...sources, imgElement]
				};

				parent.children[index] = picture;
			} else {
				// Just update the img properties
				node.properties = imgProps;
			}
		});
	};
}
