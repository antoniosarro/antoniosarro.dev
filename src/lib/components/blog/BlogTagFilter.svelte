<script lang="ts">
	import Close from '~icons/radix-icons/cross-2';
	import Tag from '~icons/solar/tag-linear';

	import { getBlogFilterState } from '$lib/stores/blog.svelte';

	interface Props {
		tags: string[];
		tagCounts?: Map<string, number>;
	}

	let { tags, tagCounts }: Props = $props();

	const blogState = getBlogFilterState();

	let showAll = $state(false);
	const INITIAL_TAGS_SHOWN = 8;

	const visibleTags = $derived(
		showAll ? tags : tags.slice(0, INITIAL_TAGS_SHOWN)
	);
	const hasMoreTags = $derived(tags.length > INITIAL_TAGS_SHOWN);
</script>

<div class="flex flex-col gap-3">
	<div class="flex items-center justify-between">
		<div class="text-accent flex items-center gap-2 text-sm font-medium">
			<Tag class="size-4" />
			<span>Filter by tags</span>
		</div>
		{#if blogState.selectedTags.length > 0}
			<button
				onclick={() => blogState.clearTags()}
				class="text-primary flex items-center gap-1 text-xs duration-200 hover:underline">
				Clear all
				<Close class="size-3" />
			</button>
		{/if}
	</div>

	<div class="flex flex-wrap gap-2">
		{#each visibleTags as tag (tag)}
			{@const isSelected = blogState.selectedTags.includes(tag)}
			{@const count = tagCounts?.get(tag)}
			<button
				onclick={() => blogState.toggleTag(tag)}
				class="group flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium duration-200 {isSelected
					? 'border-primary bg-primary text-background'
					: 'border-elevation-one hover:border-primary hover:text-primary'}"
				aria-pressed={isSelected}>
				<span>{tag}</span>
				{#if count !== undefined}
					<span
						class="text-xs opacity-60 {isSelected
							? 'text-background/80'
							: 'group-hover:text-primary/80'}">
						({count})
					</span>
				{/if}
			</button>
		{/each}

		{#if hasMoreTags}
			<button
				onclick={() => (showAll = !showAll)}
				class="border-elevation-one text-accent hover:border-primary hover:text-primary rounded-full border border-dashed px-3 py-1.5 text-sm font-medium duration-200">
				{showAll ? 'Show less' : `+${tags.length - INITIAL_TAGS_SHOWN} more`}
			</button>
		{/if}
	</div>
</div>
