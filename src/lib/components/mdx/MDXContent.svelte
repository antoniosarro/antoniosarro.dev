<script lang="ts">
	/* eslint svelte/no-at-html-tags: "off" */

	import { onDestroy, onMount } from 'svelte';
	import { mount, unmount } from 'svelte';

	import AWrapper from './wrappers/AWrapper.svelte';
	import DirectoryTreeWrapper from './wrappers/DirectoryTreeWrapper.svelte';
	import H2Wrapper from './wrappers/H2Wrapper.svelte';
	import H3Wrapper from './wrappers/H3Wrapper.svelte';
	import OlWrapper from './wrappers/OlWrapper.svelte';
	import PreWrapper from './wrappers/PreWrapper.svelte';
	import UlWrapper from './wrappers/UlWrapper.svelte';
	import ZoomableImageWrapper from './wrappers/ZoomableImageWrapper.svelte';

	interface Props {
		html: string;
		codeBlocks: Array<{
			index: number;
			title?: string;
			language?: string;
			code: string;
		}>;
	}

	let { html, codeBlocks }: Props = $props();

	let container: HTMLDivElement;
	let mountedComponents: Array<ReturnType<typeof mount>> = [];

	onMount(() => {
		if (!container) return;

		replaceHeadings();
		replaceLinks();
		replaceLists();
		replaceCodeBlocks();
		replaceDirectoryTrees();
		replaceImages();
	});

	onDestroy(() => {
		for (const component of mountedComponents) {
			void unmount(component, { outro: true });
		}
		mountedComponents = [];
	});

	function replaceHeadings() {
		// Replace H2
		const h2Elements = container.querySelectorAll('h2[id]');
		h2Elements.forEach((h2) => {
			const id = h2.getAttribute('id') || '';
			const innerHTML = h2.innerHTML;
			const placeholder = document.createElement('div');
			h2.parentNode?.replaceChild(placeholder, h2);

			const component = mount(H2Wrapper, {
				target: placeholder,
				props: { id, html: innerHTML }
			});
			mountedComponents.push(component);
		});

		// Replace H3
		const h3Elements = container.querySelectorAll('h3[id]');
		h3Elements.forEach((h3) => {
			const id = h3.getAttribute('id') || '';
			const innerHTML = h3.innerHTML;
			const placeholder = document.createElement('div');
			h3.parentNode?.replaceChild(placeholder, h3);

			const component = mount(H3Wrapper, {
				target: placeholder,
				props: { id, html: innerHTML }
			});
			mountedComponents.push(component);
		});
	}

	function replaceLinks() {
		const links = container.querySelectorAll('a:not(.link-hover)');
		links.forEach((link) => {
			const href = link.getAttribute('href') || '';
			const innerHTML = link.innerHTML;
			const placeholder = document.createElement('span');
			link.parentNode?.replaceChild(placeholder, link);

			const component = mount(AWrapper, {
				target: placeholder,
				props: { href, html: innerHTML }
			});
			mountedComponents.push(component);
		});
	}

	function replaceLists() {
		// Unordered lists
		const ulElements = container.querySelectorAll('ul');
		ulElements.forEach((ul) => {
			const innerHTML = ul.innerHTML;
			const placeholder = document.createElement('div');
			ul.parentNode?.replaceChild(placeholder, ul);

			const component = mount(UlWrapper, {
				target: placeholder,
				props: { html: innerHTML }
			});
			mountedComponents.push(component);
		});

		// Ordered lists
		const olElements = container.querySelectorAll('ol');
		olElements.forEach((ol) => {
			const innerHTML = ol.innerHTML;
			const placeholder = document.createElement('div');
			ol.parentNode?.replaceChild(placeholder, ol);

			const component = mount(OlWrapper, {
				target: placeholder,
				props: { html: innerHTML }
			});
			mountedComponents.push(component);
		});
	}

	function replaceCodeBlocks() {
		const preElements = container.querySelectorAll('pre');

		preElements.forEach((pre, index) => {
			const codeBlock = codeBlocks[index];
			if (!codeBlock) return;

			const placeholder = document.createElement('div');
			pre.parentNode?.replaceChild(placeholder, pre);

			const showLineNumbers =
				pre.querySelector('code[data-line-numbers]') !== null;
			const codeElement = pre.querySelector('code');
			const maxDigits = codeElement?.getAttribute(
				'data-line-numbers-max-digits'
			);

			const component = mount(PreWrapper, {
				target: placeholder,
				props: {
					title: codeBlock.title,
					language: codeBlock.language,
					html: codeBlock.code,
					showLineNumbers: showLineNumbers,
					maxDigits: maxDigits ? parseInt(maxDigits) : undefined
				}
			});
			mountedComponents.push(component);
		});
	}

	function replaceDirectoryTrees() {
		const treeElements = container.querySelectorAll('directory-tree');
		treeElements.forEach((el) => {
			const structure = el.getAttribute('structure') || '';
			const title = el.getAttribute('title') || undefined;
			const placeholder = document.createElement('div');
			el.parentNode?.replaceChild(placeholder, el);
			const component = mount(DirectoryTreeWrapper, {
				target: placeholder,
				props: { structure, title }
			});
			mountedComponents.push(component);
		});
	}

	function replaceImages() {
		// Target both picture elements and standalone img elements
		const pictures = container.querySelectorAll('picture.optimized-image');
		const standaloneImages = container.querySelectorAll(
			'img:not(picture img):not(.zoomable-image-trigger img)'
		);

		// Replace picture elements
		pictures.forEach((picture) => {
			const img = picture.querySelector('img');
			if (!img) return;

			const src = img.getAttribute('src') || '';
			const alt = img.getAttribute('alt') || '';
			const width = img.getAttribute('width');
			const height = img.getAttribute('height');

			const placeholder = document.createElement('div');
			placeholder.className = 'zoomable-image-container my-4';
			picture.parentNode?.replaceChild(placeholder, picture);

			const component = mount(ZoomableImageWrapper, {
				target: placeholder,
				props: {
					src,
					alt,
					width: width ? parseInt(width) : undefined,
					height: height ? parseInt(height) : undefined
				}
			});
			mountedComponents.push(component);
		});

		// Replace standalone images
		standaloneImages.forEach((img) => {
			const src = img.getAttribute('src') || '';
			const alt = img.getAttribute('alt') || '';
			const width = img.getAttribute('width');
			const height = img.getAttribute('height');

			// Skip if already processed or is an avatar/icon
			if (
				img.closest('.zoomable-image-container') ||
				img.classList.contains('rounded-full') ||
				(width && parseInt(width) < 100)
			) {
				return;
			}

			const placeholder = document.createElement('div');
			placeholder.className = 'zoomable-image-container my-4';
			img.parentNode?.replaceChild(placeholder, img);

			const component = mount(ZoomableImageWrapper, {
				target: placeholder,
				props: {
					src,
					alt,
					width: width ? parseInt(width) : undefined,
					height: height ? parseInt(height) : undefined
				}
			});
			mountedComponents.push(component);
		});
	}
</script>

<div bind:this={container} class="mdsvex">
	{@html html}
</div>
