<script lang="ts">
	import { darkMode } from '$lib/stores/theme.svelte';
</script>

<a
	href="https://www.buymeacoffee.com/antoniosarro"
	class="group border-elevation-one hover:border-primary flex min-h-[110px] flex-col items-center justify-center gap-2 rounded-lg border p-6 text-center duration-300"
	target="_blank"
	rel="noreferrer noopener">
	Like what I do? A coffee would be greatly appreciated!?
	<img
		class="grayscale duration-300 group-hover:grayscale-0"
		alt="Buymeacoffee button"
		loading="lazy"
		src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=antoniosarro&button_colour={darkMode.value
			? 'f67e82'
			: '81090d'}&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" />
</a>
