<script lang="ts">
	let mouseX = $state(0);
	let mouseY = $state(0);
	let opacity = $state(0);
	let scale = $state(1);

	let timeout: ReturnType<typeof setTimeout>;

	function onMouseMove(e: MouseEvent) {
		mouseX = e.clientX;
		mouseY = e.clientY;
		opacity = 1;

		clearTimeout(timeout);
		timeout = setTimeout(() => {
			opacity = 0;
		}, 500);
	}
</script>

<svelte:window
	onmousemove={onMouseMove}
	on:mousedown={() => (scale = 1.5)}
	on:mouseup={() => (scale = 1)}
/>

<div
	class="cursor-ring pointer-events-none fixed left-0 top-0 z-30 h-7 w-7 rounded-full border border-primary opacity-0"
	style="transform: translateX({mouseX - 15}px) translateY({mouseY - 15}px) scale({scale})"
	style:opacity
></div>

<style lang="css">
	.cursor-ring {
		transition: 0.3s all cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}
</style>
