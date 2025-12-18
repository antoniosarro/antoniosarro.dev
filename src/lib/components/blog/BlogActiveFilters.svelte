<script lang="ts">
	import Close from '~icons/radix-icons/cross-2';
	import Filter from '~icons/solar/filter-linear';

	import { getBlogFilterState } from '$lib/stores/blog.svelte';

	interface Props {
		resultCount: number;
	}

	let { resultCount }: Props = $props();

	const state = getBlogFilterState();

	const resultText = $derived(resultCount === 1 ? 'result' : 'results');
</script>

{#if state.hasActiveFilters}
	<div
		class="flex flex-wrap items-center gap-3 rounded-lg border border-elevation-one bg-elevation-one/30 p-3"
	>
		<div class="flex items-center gap-2 text-sm text-accent">
			<Filter class="size-4" />
			<span>{resultCount} {resultText}</span>
		</div>

		<div class="flex flex-wrap items-center gap-2">
			{#if state.search}
				<span
					class="flex items-center gap-1.5 rounded-full border border-elevation-one bg-background px-3 py-1 text-sm"
				>
					<span class="text-accent">Search:</span>
					<span class="font-medium text-foreground">"{state.search}"</span>
					<button
						onclick={() => state.clearSearch()}
						class="ml-1 text-accent duration-200 hover:text-primary"
						aria-label="Clear search"
					>
						<Close class="size-3" />
					</button>
				</span>
			{/if}

			{#each state.selectedTags as tag (tag)}
				<span
					class="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm"
				>
					<span class="font-medium text-primary">{tag}</span>
					<button
						onclick={() => state.toggleTag(tag)}
						class="text-primary/60 duration-200 hover:text-primary"
						aria-label="Remove tag {tag}"
					>
						<Close class="size-3" />
					</button>
				</span>
			{/each}

			{#if state.viewMode !== 'all'}
				<span
					class="flex items-center gap-1.5 rounded-full border border-elevation-one bg-background px-3 py-1 text-sm"
				>
					<span class="text-accent">View:</span>
					<span class="font-medium text-foreground">
						{state.viewMode === 'series' ? 'Series only' : 'Single posts only'}
					</span>
					<button
						onclick={() => (state.viewMode = 'all')}
						class="ml-1 text-accent duration-200 hover:text-primary"
						aria-label="Clear view filter"
					>
						<Close class="size-3" />
					</button>
				</span>
			{/if}
		</div>

		<button
			onclick={() => state.clearAll()}
			class="ml-auto text-sm text-primary duration-200 hover:underline"
		>
			Clear all filters
		</button>
	</div>
{/if}
