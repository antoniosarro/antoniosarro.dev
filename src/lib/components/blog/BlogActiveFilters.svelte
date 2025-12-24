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
		class="border-elevation-one bg-elevation-one/30 flex flex-wrap items-center gap-3 rounded-lg border p-3">
		<div class="text-accent flex items-center gap-2 text-sm">
			<Filter class="size-4" />
			<span>{resultCount} {resultText}</span>
		</div>

		<div class="flex flex-wrap items-center gap-2">
			{#if state.search}
				<span
					class="border-elevation-one bg-background flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm">
					<span class="text-accent">Search:</span>
					<span class="text-foreground font-medium">"{state.search}"</span>
					<button
						onclick={() => state.clearSearch()}
						class="text-accent hover:text-primary ml-1 duration-200"
						aria-label="Clear search">
						<Close class="size-3" />
					</button>
				</span>
			{/if}

			{#each state.selectedTags as tag (tag)}
				<span
					class="border-primary/20 bg-primary/10 flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm">
					<span class="text-primary font-medium">{tag}</span>
					<button
						onclick={() => state.toggleTag(tag)}
						class="text-primary/60 hover:text-primary duration-200"
						aria-label="Remove tag {tag}">
						<Close class="size-3" />
					</button>
				</span>
			{/each}

			{#if state.viewMode !== 'all'}
				<span
					class="border-elevation-one bg-background flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm">
					<span class="text-accent">View:</span>
					<span class="text-foreground font-medium">
						{state.viewMode === 'series' ? 'Series only' : 'Single posts only'}
					</span>
					<button
						onclick={() => (state.viewMode = 'all')}
						class="text-accent hover:text-primary ml-1 duration-200"
						aria-label="Clear view filter">
						<Close class="size-3" />
					</button>
				</span>
			{/if}
		</div>

		<button
			onclick={() => state.clearAll()}
			class="text-primary ml-auto text-sm duration-200 hover:underline">
			Clear all filters
		</button>
	</div>
{/if}
