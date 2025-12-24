<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import Moon from '~icons/hugeicons/moon-01';
	import Sun from '~icons/solar/sun-linear';

	import { darkMode } from '$lib/stores/theme.svelte';

	onMount(() => {
		darkMode.init();
	});

	onDestroy(() => {
		darkMode.destroy();
	});
</script>

<button
	onclick={() => darkMode.toggle()}
	aria-label="Toggle theme"
	aria-pressed={darkMode.value}
	class="border-elevation-one text-accent rounded-full border p-2 transition-transform duration-300 {!darkMode.value
		? '-rotate-180'
		: 'rotate-0'}">
	{#if darkMode.value}
		<Moon width={22} height={22} class="flex" />
	{:else}
		<Sun width={22} height={22} class="flex" />
	{/if}
</button>
