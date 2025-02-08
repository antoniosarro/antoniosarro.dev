<script lang="ts">
	import 'iconify-icon';

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
	rel={!internal ? 'noopener noreferrer' : undefined}
>
	{@render children()}
	{#if !internal}
		<iconify-icon noobserver icon="ci:external-link"></iconify-icon>
	{/if}
</a>

<style lang="postcss">
	a {
		@apply inline-flex items-center gap-1 text-primary;
		background-image: linear-gradient(currentColor, currentColor);
		background-repeat: no-repeat;
		background-position: 0% 100%;
		background-size: 0% 1.7px;
		transition: background-size 0.25s ease;

		&:hover {
			background-size: 100% 1.7px;
		}
	}
</style>
