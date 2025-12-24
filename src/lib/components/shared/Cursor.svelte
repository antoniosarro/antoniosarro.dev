<script lang="ts">
	let cursorStyle = $state('');
	let opacity = $state(0);

	let timeoutId: ReturnType<typeof setTimeout> | undefined;

	function onMouseMove(e: MouseEvent) {
		const x = e.clientX - 15;
		const y = e.clientY - 15;
		cursorStyle = `translate(${x}px, ${y}px)`;
		opacity = 1;

		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			opacity = 0;
		}, 500);
	}

	let scale = $state(1);
</script>

<svelte:window
	onmousemove={onMouseMove}
	onmousedown={() => (scale = 1.5)}
	onmouseup={() => (scale = 1)} />

<div
	class="border-primary pointer-events-none fixed top-0 left-0 z-30 size-7 rounded-full border transition-all duration-300 ease-out"
	style:transform="{cursorStyle} scale({scale})"
	style:opacity>
</div>
