<script lang="ts">
	let progress = $state(0);

	function updateProgress() {
		const scrollTop = window.scrollY;
		const docHeight =
			document.documentElement.scrollHeight - window.innerHeight;
		progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
	}

	$effect(() => {
		updateProgress();
		window.addEventListener('scroll', updateProgress, { passive: true });
		window.addEventListener('resize', updateProgress, { passive: true });

		return () => {
			window.removeEventListener('scroll', updateProgress);
			window.removeEventListener('resize', updateProgress);
		};
	});
</script>

<div
	class="bg-primary fixed top-0 left-0 z-50 h-1 transition-all duration-150 ease-out"
	style="width: {progress}%"
	role="progressbar"
	aria-valuenow={Math.round(progress)}
	aria-valuemin={0}
	aria-valuemax={100}
	aria-label="Reading progress">
</div>
