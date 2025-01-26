<script lang="ts">
	import 'iconify-icon';
	import { darkMode, initDarkMode, toggleDarkMode } from '$lib/stores/dark.svelte';

	$effect(() => {
		initDarkMode();
	});
</script>

<button
	class="rounded-full border border-elevation-one p-2 text-accent transition-transform duration-300 {!$darkMode
		? '-rotate-180'
		: 'rotate-0'}"
	onclick={toggleDarkMode}
	aria-label="Toggle Theme"
>
	{#if $darkMode}
		<iconify-icon noobserver height="22" width="22" class="flex" icon="hugeicons:moon-01"
		></iconify-icon>
	{:else}
		<iconify-icon noobserver height="22" width="22" class="flex" icon="solar:sun-linear"
		></iconify-icon>
	{/if}
</button>
