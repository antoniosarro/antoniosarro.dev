<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { fade, scale } from 'svelte/transition';

	interface Props {
		src: string;
		alt: string;
		width?: number;
		height?: number;
		class?: string;
	}

	let { src, alt, width, height, class: className = '' }: Props = $props();

	let isZoomed = $state(false);

	function openZoom() {
		isZoomed = true;
	}

	function closeZoom() {
		isZoomed = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isZoomed) {
			closeZoom();
		}
	}

	// Get optimized image paths
	const basePath = $derived(src.replace(/\.[^/.]+$/, ''));
	const originalExt = $derived(src.match(/\.[^/.]+$/)?.[0] || '.png');
	const isOptimizable = $derived(src.startsWith('/images/'));

	$effect(() => {
		if (isZoomed) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Thumbnail -->
<button
	type="button"
	class="group relative block w-full cursor-zoom-in border-0 bg-transparent p-0 {className}"
	onclick={openZoom}
	aria-label="Click to zoom image: {alt}">
	{#if isOptimizable}
		<picture>
			<source srcset="{basePath}.avif" type="image/avif" />
			<source srcset="{basePath}.webp" type="image/webp" />
			<img
				src="{basePath}{originalExt}"
				{alt}
				{width}
				{height}
				loading="lazy"
				decoding="async"
				class="rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
				style="max-width: 100%; height: auto;" />
		</picture>
	{:else}
		<img
			{src}
			{alt}
			{width}
			{height}
			loading="lazy"
			decoding="async"
			class="rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
			style="max-width: 100%; height: auto;" />
	{/if}
</button>

<!-- Zoomed Modal -->
{#if isZoomed}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4"
		role="dialog"
		aria-modal="true"
		aria-label="Zoomed image: {alt}">
		<!-- Backdrop -->
		<button
			type="button"
			class="bg-background/60 absolute inset-0 cursor-zoom-out backdrop-blur-md"
			onclick={closeZoom}
			aria-label="Close zoomed image"
			transition:fade={{ duration: 200 }}>
		</button>

		<!-- Image container -->
		<div
			class="relative z-10 flex max-h-[90vh] max-w-[90vw] items-center justify-center"
			transition:scale={{ start: 0.9, duration: 300, easing: cubicOut }}>
			<!-- Zoomed image -->
			{#if isOptimizable}
				<picture>
					<source srcset="{basePath}.avif" type="image/avif" />
					<source srcset="{basePath}.webp" type="image/webp" />
					<img
						src="{basePath}{originalExt}"
						{alt}
						class="border-elevation-one max-h-[85vh] max-w-full rounded-lg border object-contain shadow-2xl"
						loading="eager" />
				</picture>
			{:else}
				<img
					{src}
					{alt}
					class="border-elevation-one max-h-[85vh] max-w-full rounded-lg border object-contain shadow-2xl"
					loading="eager" />
			{/if}
		</div>
	</div>
{/if}
