<script lang="ts">
	import type { HTMLImgAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLImgAttributes, 'src'> {
		src: string;
		alt: string;
		class?: string;
		eager?: boolean;
		sizes?: string;
	}

	let {
		src,
		alt,
		class: className = '',
		eager = false,
		sizes,
		...restProps
	}: Props = $props();

	// Extract base path without extension
	const basePath = $derived(src.replace(/\.[^/.]+$/, ''));
	const originalExt = $derived(src.match(/\.[^/.]+$/)?.[0] || '.png');

	// Check if this is an optimizable image path
	const isOptimizable = $derived(src.startsWith('/images/'));

	// For external images or non-optimizable paths, just use the original
	const shouldOptimize = $derived(isOptimizable && !src.startsWith('http'));
</script>

{#if shouldOptimize}
	<picture class="optimized-image {className}">
		<source srcset="{basePath}.avif" type="image/avif" {sizes} />
		<source srcset="{basePath}.webp" type="image/webp" {sizes} />
		<img
			src="{basePath}{originalExt}"
			{alt}
			loading={eager ? 'eager' : 'lazy'}
			decoding={eager ? 'sync' : 'async'}
			class={className}
			{...restProps} />
	</picture>
{:else}
	<img
		{src}
		{alt}
		loading={eager ? 'eager' : 'lazy'}
		decoding={eager ? 'sync' : 'async'}
		class={className}
		{...restProps} />
{/if}

<style>
	picture {
		display: contents;
	}
</style>
