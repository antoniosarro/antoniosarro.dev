<script lang="ts">
	import Link from '~icons/ci/external-link';

	import type { Snippet } from 'svelte';

	let {
		href,
		children
	}: {
		href: string;
		children: Snippet;
	} = $props();

	const internal = $derived(href.startsWith('/') || href.startsWith('#'));
</script>

<a
	{href}
	target={!internal ? '_blank' : undefined}
	rel={!internal ? 'noopener noreferrer' : undefined}>
	{@render children()}
	{#if !internal}
		<Link />
	{/if}
</a>

<style lang="postcss">
	@reference "../../../../app.css";

	a {
		@apply text-primary inline-flex items-center gap-1;
		background-image: linear-gradient(currentColor, currentColor);
		background-repeat: no-repeat;
		background-position: 0% 100%;
		background-size: 0% 1.7px;
		transition: background-size 0.25s ease;
	}

	a:hover {
		background-size: 100% 1.7px;
	}
</style>
