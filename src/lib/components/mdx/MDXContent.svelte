<script lang="ts">
	import { onMount } from 'svelte';
	import { mount, unmount } from 'svelte';
	import PreWrapper from './wrappers/PreWrapper.svelte';
	import H2Wrapper from './wrappers/H2Wrapper.svelte';
	import H3Wrapper from './wrappers/H3Wrapper.svelte';
	import AWrapper from './wrappers/AWrapper.svelte';
	import UlWrapper from './wrappers/UlWrapper.svelte';
	import OlWrapper from './wrappers/OlWrapper.svelte';

	interface Props {
		html: string;
		codeBlocks: Array<{ index: number; title?: string; language?: string; code: string }>;
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

		return () => {
			mountedComponents.forEach((component) => unmount(component, { outro: true }));
			mountedComponents = [];
		};
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

			const showLineNumbers = pre.querySelector('code[data-line-numbers]') !== null;
			const codeElement = pre.querySelector('code');
			const maxDigits = codeElement?.getAttribute('data-line-numbers-max-digits');

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
</script>

<div bind:this={container} class="mdsvex">
	{@html html}
</div>
