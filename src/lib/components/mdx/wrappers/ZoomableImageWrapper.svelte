<script lang="ts">
	import ZoomableImage from '../ZoomableImage.svelte';

	let {
		src,
		alt,
		width,
		height
	}: {
		src: string;
		alt: string;
		width?: number;
		height?: number;
	} = $props();
</script>

<ZoomableImage {src} {alt} {width} {height} />
