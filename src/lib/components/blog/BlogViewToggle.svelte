<script lang="ts">
	import Book from '~icons/solar/book-2-linear';
	import List from '~icons/solar/list-linear';
	import Grid from '~icons/solar/widget-2-linear';

	import { getBlogFilterState } from '$lib/stores/blog.svelte';

	const state = getBlogFilterState();

	const modes = [
		{ value: 'all' as const, label: 'All Posts', icon: Grid },
		{ value: 'standalone' as const, label: 'Single Posts', icon: List },
		{ value: 'series' as const, label: 'Series', icon: Book }
	];
</script>

<div class="border-elevation-one flex items-center gap-1 rounded-lg border p-1">
	{#each modes as { value, label, icon } (value)}
		{@const Icon = icon}
		{@const isActive = state.viewMode === value}
		<button
			onclick={() => (state.viewMode = value)}
			class="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium duration-200 {isActive
				? 'bg-primary text-background'
				: 'text-accent hover:bg-elevation-one hover:text-foreground'}"
			aria-pressed={isActive}
			title={label}>
			<Icon class="size-4" />
			<span class="hidden sm:inline">{label}</span>
		</button>
	{/each}
</div>
