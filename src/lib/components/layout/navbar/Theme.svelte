<script lang="ts">
	import Moon from '~icons/hugeicons/moon-01';
	import Sun from '~icons/solar/sun-linear';

	import { darkMode } from '$lib/stores/theme.svelte';
	import { onMount, onDestroy } from 'svelte';

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
	class="rounded-full border border-elevation-one p-2 text-accent transition-transform duration-300 {!darkMode.value
		? '-rotate-180'
		: 'rotate-0'}"
>
	{#if darkMode.value}
		<Moon width={22} height={22} class="flex" />
	{:else}
		<Sun width={22} height={22} class="flex" />
	{/if}
</button>
