<script lang="ts">
	import { onMount } from 'svelte';

	import { getHeadings } from '$utils/blog';

	let { html }: { html: string } = $props();

	let contents = $derived(getHeadings(html));
	let activeID = $state('introduction');

	onMount(() => {
		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	function handleScroll() {
		if (contents) {
			const headings = contents.map((c) => document.getElementById(c.id));
			headings.unshift(document.getElementById('introduction'));

			const visibleHeadings = headings.filter((el) => isElementInView(el!));
			if (visibleHeadings.length > 0) {
				activeID = visibleHeadings[0]?.id || 'introduction';
			}
		}
	}

	function isElementInView(element: HTMLElement) {
		if (!element) return false;
		const rect = element.getBoundingClientRect();
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	}
</script>

<h3 class="mb-4 text-xl font-semibold tracking-tight">Table of Contents</h3>
<nav>
	<a href="#introduction" class="link H2" class:active={activeID === 'introduction'}>
		Introduction
	</a>
	{#if contents}
		{#each contents as { text, id, level }}
			<a class="link H{level}" class:active={activeID === id} href="#{id}">{text}</a>
		{/each}
	{/if}
</nav>

<style lang="postcss">
	.link {
		@apply block opacity-60 transition-all duration-300;
		&.active {
			@apply font-semibold text-primary opacity-100;
		}
		&:hover {
			@apply opacity-100;
		}
		&.H2 {
			@apply mt-3;
		}

		&.H3,
		&.H4,
		&.H5,
		&.H6 {
			@apply mt-1;
		}

		&:first-child {
			@apply mt-0;
		}

		&.H3 {
			@apply ml-5;
		}
	}
</style>
