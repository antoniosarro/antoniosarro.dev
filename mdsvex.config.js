import { escapeSvelte } from '@huntabyte/mdsvex';
import { transformerNotationHighlight } from '@shikijs/transformers';
import { toHtml } from 'hast-util-to-html';
import { resolve } from 'path';
import readingTime from 'reading-time'
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import { getSingletonHighlighter } from 'shiki';
import { visit } from 'unist-util-visit';

/* REMARK */
const remarkReplaceQuotes = () => (tree) => {
	visit(tree, 'text', (node) => {
		node.value = node.value
			.replace(/”/g, '"') // Replace curly double quotes with straight double quotes
			.replace(/“/g, '"') // Replace straight double quotes with straight double quotes
			.replace(/’/g, "'") // Replace curly single quotes with straight single quotes
			.replace(/‘/g, "'"); // Replace straight single quotes with straight single quotes
	});
};


const remarkReadingTime = (options={}) => {
	const defaultOpt = {
		attribute: "readingTime",
        wpm: 200
	}

	let config = Object.assign({}, defaultOpt, options);
	return (tree, file) => {
		let content = "";
		visit(tree, ['code', 'text'], (node) => {
			content += node.value;
		});

		if (!file.data.fm) {
			file.data.fm = {};
		}

		file.data.fm[config.attribute] = readingTime(content, {wordsPerMinute : config.wpm});
	}
}

/* REHYPE */
function rehypeCustomComponents() {
	return async (tree) => {
		const hTags = [
			'Components.h1',
			'Components.h2',
			'Components.h3',
			'Components.h4',
			'Components.h5',
			'Components.h6'
		];

		visit(tree, (node) => {
			// Check h tags, and pass some extra parameters to the custom components.
			if (node?.type === 'element' && hTags.includes(node?.tagName)) {
				node.properties['id'] = node.children[0].value.split(' ').join('-').toLowerCase();
				node.properties['headerTag'] = node.tagName.split('.')[1];
			}
		});
	};
}

function rehypeComponentPreToPre() {
	return async (tree) => {
		// Replace `Component.pre` tags with regular `pre` tags.
		// This enables us to use rehype-pretty-code with our custom `pre` component.
		visit(tree, (node) => {
			if (node?.type === 'element' && node?.tagName === 'Components.pre') {
				node.tagName = 'pre';
			}
		});
	};
}

const prettyCodeOptions = {
	theme: 'material-theme',
	keepBackground: false,
	onVisitLine(node) {
		if (node.children.length === 0) {
			node.children = { type: 'text', value: ' ' };
		}
	},
	getHighlighter: (options) => {
		return getSingletonHighlighter({
			...options,
			langs: [
				'plaintext',
				import('shiki/langs/svelte.mjs'),
				import('shiki/langs/typescript.mjs'),
				import('shiki/langs/bash.mjs'),
				import('shiki/langs/yml.mjs')
			]
		});
	},
	transformers: [transformerNotationHighlight({ matchAlgorithm: 'v3' })]
};

function rehypeHandleMetadata() {
	return async (tree) => {
		visit(tree, (node) => {
			if (node?.type === 'element' && node?.tagName === 'figure') {
				if (!('data-rehype-pretty-code-figure' in node.properties)) {
					return;
				}

				const titleElement = node.children[0];
				const preElement = node.children.at(-1);
				if (
					preElement.tagName !== 'pre' ||
					!('data-rehype-pretty-code-title' in titleElement.properties)
				) {
					return;
				}

				if (titleElement.children.length > 0 && 'value' in titleElement.children[0]) {
					preElement.properties['title'] = titleElement.children[0].value;
					preElement.properties['language'] = node.children[0].properties['data-language'];
					node.children.shift();
				}
			}
		});
	};
}

function processCustomCodeBlockHighlights(children) {
	children.forEach((child) => {
		if (child.type === 'element' && child.tagName === 'span' && 'data-line' in child.properties) {
			let shouldAddHighlight = false;
			let shouldRemoveHighlight = false;

			child.children.forEach((innerChild) => {
				if (innerChild.type === 'element' && innerChild.tagName === 'span') {
					const textNode = innerChild.children.find((c) => c.type === 'text');
					if (textNode && textNode.value) {
						const addHighlightPatterns = ['# ++add', '// ++add', '#++add', '//++add'];
						const removeHighlightPatterns = ['# --del', '// --del', '#--del', '//--del'];

						addHighlightPatterns.forEach((pattern) => {
							if (textNode.value.includes(pattern)) {
								shouldAddHighlight = true;
								textNode.value = textNode.value.replace(pattern, '').trim();
							}
						});

						removeHighlightPatterns.forEach((pattern) => {
							if (textNode.value.includes(pattern)) {
								shouldRemoveHighlight = true;
								textNode.value = textNode.value.replace(pattern, '').trim();
							}
						});
					}
				}
			});

			if (shouldAddHighlight) {
				child.properties['data-highlighted-line-id'] = 'add';
				child.properties['data-highlighted-line'] = '';
			} else if (shouldRemoveHighlight) {
				child.properties['data-highlighted-line-id'] = 'remove';
				child.properties['data-highlighted-line'] = '';
			}
		}

		// Recursively traverse inner children
		if (child.children && child.children.length > 0) {
			processCustomCodeBlockHighlights(child.children);
		}
	});
}

function tabsToSpaces(code) {
	return code.replaceAll('    ', '    ').replaceAll('\t', '    ');
}

function rehypeRenderCode() {
	return async (tree) => {
		visit(tree, (node) => {
			if (
				node?.type === 'element' &&
				(node?.tagName === 'Components.pre' || node?.tagName === 'pre')
			) {
				const codeEl = node.children[0];
				if (codeEl.tagName !== 'code') {
					return;
				}

				if (codeEl && node.properties['data-language'] !== 'md') {
					processCustomCodeBlockHighlights(codeEl.children);
				}

				const codeString = tabsToSpaces(
					toHtml(codeEl, {
						allowDangerousCharacters: true,
						allowDangerousHtml: true
					})
				);

				codeEl.type = 'raw';
				codeEl.value = `{@html \`${escapeSvelte(codeString)}\`}`;
			}
		});
	};
}

function rehypePreToComponentPre() {
	return async (tree) => {
		/**
		 * Replace `pre` tags with our custom `Component.pre` tags.
		 * This enables us to use rehype-pretty-code with our custom `pre` component.
		 * We also add the raw html string as a parameter for the copy button.
		 */
		visit(tree, (node) => {
			if (node?.type === 'element' && node?.tagName === 'pre') {
				node.tagName = 'Components.pre';
			}
		});
	};
}

const correctHastTree = () => (tree) => {
	visit(tree, 'text', (node) => {
		if (node.value.trim().startsWith('<')) {
			node.type = 'raw';
		}
	});
};

export const mdsvexOptions = {
	extensions: ['.mdx'],
	layout: {
		_: resolve('./src/components/mdx/Blueprint.svelte')
	},
	remarkPlugins: [
		remarkReplaceQuotes,
		[
			remarkReadingTime,
			{
				wpm: 200
			}
		]
	],
	rehypePlugins: [
		rehypeCustomComponents,
		rehypeComponentPreToPre,
		[rehypePrettyCode, prettyCodeOptions],
		rehypeHandleMetadata,
		rehypeRenderCode,
		rehypePreToComponentPre,
		rehypeSlug,
		correctHastTree
	]
};
