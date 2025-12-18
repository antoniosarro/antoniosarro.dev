import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import { transformerNotationHighlight } from '@shikijs/transformers';
import { getSingletonHighlighter } from 'shiki';
import { visit } from 'unist-util-visit';
import { toHtml } from 'hast-util-to-html';
import type { Plugin } from 'unified';
import type { Root, Element, Text, ElementContent } from 'hast';
import type { Node } from 'unist';
import fs from 'fs';
import path from 'path';
import { rehypeOptimizeImages } from './image-transformer';

// ============================
// Types
// ============================

/**
 * Metadata extracted from a heading element
 */
export interface HeadingMetadata {
	/** URL-safe heading identifier */
	id: string;
	/** Plain text content of the heading */
	text: string;
	/** Heading level (1-6) */
	level: number;
}

/**
 * Metadata extracted from a code block
 */
export interface CodeBlockMetadata {
	/** Sequential index of the code block in the document */
	index: number;
	/** Optional title for the code block */
	title?: string;
	/** Programming language identifier */
	language?: string;
	/** Processed HTML content with syntax highlighting */
	code: string;
}

/**
 * Complete processed MDX content with extracted metadata
 */
export interface ProcessedContent {
	/** Fully processed HTML string */
	html: string;
	/** All headings found in the document */
	headings: HeadingMetadata[];
	/** All code blocks found in the document */
	codeBlocks: CodeBlockMetadata[];
}

/**
 * Reading time statistics for a document
 */
export interface ReadingTimeStats {
	/** Human-readable reading time (e.g., "5 min read") */
	text: string;
	/** Reading time in minutes (rounded up) */
	minutes: number;
	/** Reading time in milliseconds */
	time: number;
	/** Total word count */
	words: number;
}

/**
 * Configuration for reading time calculation
 */
interface ReadingTimeConfig {
	/** Frontmatter attribute name for reading time data */
	attribute: string;
	/** Average words per minute reading speed */
	wpm: number;
}

/**
 * Extended node type for AST manipulation
 */
interface ExtendedNode extends Node {
	type: string;
	value?: string;
	tagName?: string;
	properties?: Record<string, any>;
	children?: ExtendedNode[];
}

// ============================
// Constants
// ============================

const HEADING_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
const DEFAULT_WORDS_PER_MINUTE = 200;
const ADD_HIGHLIGHT_PATTERNS = ['# ++add', '// ++add', '#++add', '//++add'] as const;
const REMOVE_HIGHLIGHT_PATTERNS = ['# --del', '// --del', '#--del', '//--del'] as const;

// ============================
// Utility Functions
// ============================

/**
 * Calculates estimated reading time for text content based on average reading speed
 *
 * @param text - Raw text content to analyze
 * @param wordsPerMinute - Average reading speed (default: 200 WPM)
 * @returns Reading time statistics including word count and time estimates
 *
 * @example
 * ```typescript
 * const stats = calculateReadingTime('Hello world from my blog post...');
 * console.log(stats.text); // "5 min read"
 * ```
 */
export function calculateReadingTime(
	text: string,
	wordsPerMinute: number = DEFAULT_WORDS_PER_MINUTE
): ReadingTimeStats {
	const words = text
		.trim()
		.split(/\s+/)
		.filter((word) => word.length > 0);

	const wordCount = words.length;
	const timeInMilliseconds = (wordCount / wordsPerMinute) * 60 * 1000;
	const minutes = Math.ceil(timeInMilliseconds / 60000);

	return {
		text: `${minutes} min read`,
		minutes,
		time: timeInMilliseconds,
		words: wordCount
	};
}

/**
 * Converts tab characters to spaces for consistent code formatting
 *
 * @param code - Code string potentially containing tabs
 * @returns Code with tabs converted to 4 spaces
 */
function tabsToSpaces(code: string): string {
	return code.replace(/\t/g, '    ');
}

/**
 * Escapes HTML special characters to prevent XSS and display issues
 *
 * @param text - Text potentially containing HTML special characters
 * @returns Escaped text safe for HTML attributes
 */
function escapeHtml(text: string): string {
	const replacements: Record<string, string> = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};

	return text.replace(/[&<>"']/g, (char) => replacements[char] ?? char);
}

/**
 * Recursively extracts plain text content from HAST nodes
 *
 * @param nodes - Array of HAST nodes to process
 * @returns Concatenated plain text from all text nodes
 */
function extractPlainText(nodes: ElementContent[]): string {
	return nodes
		.map((node) => {
			if (node.type === 'text') {
				return node.value;
			}
			if (node.type === 'element' && node.children) {
				return extractPlainText(node.children);
			}
			return '';
		})
		.join('');
}

// ============================
// Metadata Extraction
// ============================

/**
 * Extracts structured metadata from processed HTML
 */
function extractMetadata(html: string): ProcessedContent {
	const headings: HeadingMetadata[] = [];
	const codeBlocks: CodeBlockMetadata[] = [];

	// Extract headings (h2 and h3 only for table of contents)
	const headingRegex = /<h([23])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h\1>/g;
	let match: RegExpExecArray | null;

	while ((match = headingRegex.exec(html)) !== null) {
		headings.push({
			level: parseInt(match[1], 10),
			id: match[2],
			text: match[3].replace(/<[^>]*>/g, '') // Strip HTML tags
		});
	}

	// Extract code blocks with metadata - look for title attribute in pre tag
	const preRegex = /<pre([^>]*)><code([^>]*)>(.*?)<\/code><\/pre>/gs;
	let codeBlockIndex = 0;

	while ((match = preRegex.exec(html)) !== null) {
		const preAttrs = match[1];
		const codeAttrs = match[2];
		const codeContent = match[3];

		// Extract title and language from pre attributes
		const titleMatch = preAttrs.match(/title="([^"]*)"/);
		const langMatch = preAttrs.match(/language="([^"]*)"/);

		// Also check data-language attribute
		const dataLangMatch = preAttrs.match(/data-language="([^"]*)"/);
		const codeLangMatch = codeAttrs.match(/data-language="([^"]*)"/);

		const title = titleMatch?.[1];
		const language = langMatch?.[1] || dataLangMatch?.[1] || codeLangMatch?.[1];

		codeBlocks.push({
			index: codeBlockIndex++,
			title: title,
			language: language,
			code: codeContent
		});
	}

	return { html, headings, codeBlocks };
}

// ============================
// Remark Plugins (Markdown Processing)
// ============================

/**
 * Remark plugin to normalize smart quotes to regular ASCII quotes
 *
 * Replaces typographic quotes with their ASCII equivalents to ensure
 * consistent rendering and prevent encoding issues.
 */
const remarkReplaceQuotes: Plugin = () => {
	return (tree) => {
		visit(tree, 'text', (node: any) => {
			node.value = node.value.replace(/[""]/g, '"').replace(/['']/g, "'");
		});
	};
};

/**
 * Remark plugin to calculate and attach reading time to file metadata
 *
 * Analyzes text and code content to estimate reading time, storing
 * the result in the file's frontmatter data object.
 *
 * @param options - Configuration for reading time calculation
 * @returns Unified plugin function
 */
export const remarkReadingTime = (options: Partial<ReadingTimeConfig> = {}) => {
	const config: ReadingTimeConfig = {
		attribute: 'readingTime',
		wpm: DEFAULT_WORDS_PER_MINUTE,
		...options
	};

	return (tree: any, file: any) => {
		let content = '';

		// Collect all text and code content
		visit(tree, ['code', 'text'], (node) => {
			content += node.value;
		});

		// Ensure frontmatter object exists
		if (!file.data.fm) {
			file.data.fm = {};
		}

		file.data.fm[config.attribute] = calculateReadingTime(content, config.wpm);
	};
};

// ============================
// Rehype Plugins (HTML Processing)
// ============================

/**
 * Rehype plugin to add custom properties to heading elements
 *
 * Generates URL-safe IDs from heading text content and stores
 * the original tag name for custom rendering.
 */
function rehypeCustomComponents(): Plugin<[], Root> {
	return (tree) => {
		visit(tree, 'element', (node: Element) => {
			if (!HEADING_TAGS.includes(node.tagName as any)) {
				return;
			}

			const textContent = extractPlainText(node.children);
			const sanitizedId = textContent
				.toLowerCase()
				.split(' ')
				.join('-')
				.replace(/[^a-z0-9-]/g, '');

			node.properties = node.properties || {};
			node.properties.id = sanitizedId;
			node.properties.headerTag = node.tagName;
		});
	};
}

function rehypeHandleMetadata(): Plugin<[], Root> {
	return (tree) => {
		visit(tree, 'element', (node: Element) => {
			// Check if it's a figure with the rehype-pretty-code marker
			if (
				node.tagName !== 'figure' ||
				!('data-rehype-pretty-code-figure' in (node.properties || {}))
			) {
				return;
			}

			let figcaption: Element | null = null;
			let preElement: Element | null = null;

			// Find figcaption and pre
			for (const child of node.children) {
				if (child.type === 'element') {
					if (child.tagName === 'figcaption') {
						figcaption = child;
					}
					if (child.tagName === 'pre') {
						preElement = child;
					}
				}
			}

			if (!preElement) {
				console.log('❌ No pre element found!');
				return;
			}

			// Extract metadata from figcaption BEFORE removing it
			if (figcaption) {
				preElement.properties = preElement.properties || {};

				// Extract title text from figcaption children
				const titleText = figcaption.children.find((child): child is Text => child.type === 'text');
				if (titleText?.value) {
					preElement.properties.title = titleText.value;
				} else {
					console.log('⚠️  No title text found in figcaption children');
				}

				// Extract language and theme from figcaption properties
				if (figcaption.properties?.['data-language']) {
					preElement.properties.language = figcaption.properties['data-language'];
					preElement.properties['data-language'] = figcaption.properties['data-language'];
				}
				if (figcaption.properties?.['data-theme']) {
					preElement.properties['data-theme'] = figcaption.properties['data-theme'];
				}
			} else {
			}

			// Handle code element
			const codeElement = preElement.children[0];
			if (codeElement?.type === 'element' && codeElement.tagName === 'code') {
				if (codeElement.properties?.['data-line-numbers'] !== undefined) {
					preElement.properties = preElement.properties || {};
					preElement.properties['data-line-numbers'] = '';
					preElement.properties['data-line-numbers-max-digits'] =
						codeElement.properties['data-line-numbers-max-digits'];
				}

				codeElement.properties = codeElement.properties || {};
				if (preElement.properties?.language) {
					codeElement.properties['data-language'] = preElement.properties.language;
				}
				if (preElement.properties?.['data-theme']) {
					codeElement.properties['data-theme'] = preElement.properties['data-theme'];
				}

				if (codeElement.properties['data-line-numbers'] !== undefined) {
					codeElement.properties.style = 'display: grid;';
				}
			}

			// REMOVE figcaption AFTER extracting all metadata
			node.children = node.children.filter(
				(child) => !(child.type === 'element' && child.tagName === 'figcaption')
			);
		});
	};
}

/**
 * Rehype plugin to remove any remaining figcaption elements
 * This runs as a final cleanup step
 */
function rehypeRemoveFigcaptions(): Plugin<[], Root> {
	return (tree) => {
		visit(tree, 'element', (node: Element) => {
			if (node.children) {
				node.children = node.children.filter(
					(child) => !(child.type === 'element' && child.tagName === 'figcaption')
				);
			}
		});
	};
}

/**
 * Recursively processes code block children to add custom highlight markers
 *
 * Scans for special comment patterns (++add, --del) and converts them
 * to data attributes for styling added/removed lines.
 *
 * @param children - Array of HAST nodes to process
 */
function processCustomCodeBlockHighlights(children: ElementContent[]): void {
	children.forEach((child) => {
		if (child.type !== 'element') {
			return;
		}

		// Process line spans
		if (child.tagName === 'span' && 'data-line' in (child.properties || {})) {
			let shouldAddHighlight = false;
			let shouldRemoveHighlight = false;

			// Check each child span for highlight markers
			child.children.forEach((innerChild) => {
				if (innerChild.type !== 'element' || innerChild.tagName !== 'span') {
					return;
				}

				const textNode = innerChild.children.find((c): c is Text => c.type === 'text');

				if (!textNode?.value) {
					return;
				}

				// Check for add patterns
				for (const pattern of ADD_HIGHLIGHT_PATTERNS) {
					if (textNode.value.includes(pattern)) {
						shouldAddHighlight = true;
						textNode.value = textNode.value.replace(pattern, '').trim();
					}
				}

				// Check for remove patterns
				for (const pattern of REMOVE_HIGHLIGHT_PATTERNS) {
					if (textNode.value.includes(pattern)) {
						shouldRemoveHighlight = true;
						textNode.value = textNode.value.replace(pattern, '').trim();
					}
				}
			});

			// Apply highlight attributes
			child.properties = child.properties || {};
			if (shouldAddHighlight) {
				child.properties['data-highlighted-line-id'] = 'add';
				child.properties['data-highlighted-line'] = '';
			} else if (shouldRemoveHighlight) {
				child.properties['data-highlighted-line-id'] = 'remove';
				child.properties['data-highlighted-line'] = '';
			}
		}

		// Recurse into nested children
		if (child.children?.length > 0) {
			processCustomCodeBlockHighlights(child.children);
		}
	});
}

/**
 * Rehype plugin to render code blocks with proper formatting and metadata
 *
 * Processes highlighted code, extracts plain text for copy functionality,
 * and converts the syntax-highlighted content to raw HTML.
 */
function rehypeRenderCode(): Plugin<[], Root> {
	return (tree) => {
		visit(tree, 'element', (node: Element) => {
			if (node.tagName !== 'pre') {
				return;
			}

			const codeEl = node.children[0];
			if (!codeEl || codeEl.type !== 'element' || codeEl.tagName !== 'code') {
				return;
			}

			// Extract plain text BEFORE processing highlights (for copy functionality)
			const plainText = extractPlainText(codeEl.children);

			// Apply custom highlighting (skip for markdown to preserve formatting)
			if (node.properties?.['data-language'] !== 'md') {
				processCustomCodeBlockHighlights(codeEl.children);
			}

			// Convert to HTML string with tabs normalized
			const codeHtml = tabsToSpaces(
				toHtml(codeEl, {
					allowDangerousCharacters: true,
					allowDangerousHtml: true
				})
			);

			// Store escaped plain text as data attribute
			node.properties = node.properties || {};
			node.properties['data-code'] = escapeHtml(plainText);

			// Convert code element to raw HTML
			(codeEl as any).type = 'raw';
			(codeEl as any).value = codeHtml;
		});
	};
}

/**
 * Rehype plugin to correct HAST tree by converting text nodes with HTML to raw nodes
 *
 * Fixes issues where HTML content is incorrectly categorized as text,
 * ensuring proper rendering in the final output.
 */
const correctHastTree: Plugin<[], Root> = () => {
	return (tree) => {
		visit(tree, 'text', (node: any) => {
			if (node.value.trim().startsWith('<')) {
				node.type = 'raw';
			}
		});
	};
};

// ============================
// Configuration
// ============================

/**
 * Configuration for rehype-pretty-code syntax highlighting
 */
const prettyCodeOptions = {
	theme: 'github-dark-default',
	keepBackground: false,

	onVisitLine(node: any) {
		if (node.children.length === 0) {
			node.children = { type: 'text', value: ' ' };
		}
	},

	getHighlighter: (options: any) => {
		return getSingletonHighlighter({
			...options,
			langs: [
				'plaintext',
				import('shiki/langs/svelte.mjs'),
				import('shiki/langs/typescript.mjs'),
				import('shiki/langs/bash.mjs'),
				import('shiki/langs/yml.mjs'),
				import('shiki/langs/nix.mjs'),
				import('shiki/langs/dockerfile.mjs'),
				import('shiki/langs/nginx.mjs')
			]
		});
	},

	transformers: [transformerNotationHighlight({ matchAlgorithm: 'v3' })]
};

// Load image metadata generated by the build script
let imageMetadata: Record<string, { width: number; height: number }> = {};
try {
	const metaPath = path.resolve('static/images/images-metadata.json');
	if (fs.existsSync(metaPath)) {
		imageMetadata = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
	}
} catch (e) {
	console.warn('⚠️ Could not load image metadata. Images will not have intrinsic size.');
}

// ============================
// Main Processing Function
// ============================

/**
 * Processes MDX content through the complete transformation pipeline
 *
 * This function orchestrates the entire MDX processing workflow:
 * 1. Parses markdown to AST
 * 2. Applies remark plugins (markdown transformations)
 * 3. Converts markdown AST to HTML AST
 * 4. Applies rehype plugins (HTML transformations, syntax highlighting)
 * 5. Converts to final HTML string
 * 6. Extracts metadata (headings, code blocks)
 *
 * @param content - Raw MDX/Markdown content string
 * @returns Processed HTML and extracted metadata
 *
 * @throws {Error} If processing fails at any stage
 *
 * @example
 * ```typescript
 * const result = await processMDX('# Hello\n\n```ts\nconst x = 1;\n```');
 * console.log(result.headings); // [{ id: 'hello', text: 'Hello', level: 1 }]
 * console.log(result.codeBlocks.length); // 1
 * ```
 */
export async function processMDX(content: string): Promise<ProcessedContent> {
	try {
		const result = await unified()
			// Parse markdown to AST
			.use(remarkParse)
			.use(remarkReplaceQuotes)

			// Convert markdown AST to HTML AST
			.use(remarkRehype, { allowDangerousHtml: true })

			// Process HTML AST
			.use(rehypeCustomComponents)
			.use(rehypeSlug)
			.use(rehypeAutolinkHeadings, {
				behavior: 'wrap',
				properties: {
					className: ['link-hover']
				}
			})
			.use(rehypeOptimizeImages)
			.use(rehypePrettyCode, prettyCodeOptions)
			.use(rehypeHandleMetadata)
			.use(rehypeRemoveFigcaptions)
			.use(rehypeRenderCode)
			.use(correctHastTree)

			// Convert to HTML string
			.use(rehypeStringify, { allowDangerousHtml: true })
			.process(content);

		const html = String(result);

		return extractMetadata(html);
	} catch (error) {
		console.error('Error during MDX processing:', error);
		throw error;
	}
}
