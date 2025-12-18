<script lang="ts">
	import type { Blog } from '$lib/types/blog';
	import { getBlogFilterState } from '$lib/stores/blog.svelte';
	import {
		filterBlogs,
		extractAllTags,
		getTagCounts,
		getSeries,
		getStandalonePosts
	} from '$lib/utils/blog';

	import BlogFilters from './BlogFilters.svelte';
	import BlogActiveFilters from './BlogActiveFilters.svelte';
	import BlogCard from './BlogCard.svelte';
	import BlogSkeleton from './BlogSkeleton.svelte';
	import SeriesCard from './SeriesCard.svelte';
	import NoResults from './NoResults.svelte';

	interface Props {
		data?: Blog[];
		loading: boolean;
	}

	let { data = [], loading }: Props = $props();

	const state = getBlogFilterState();

	// Derived data
	const allTags = $derived(extractAllTags(data));
	const tagCounts = $derived(getTagCounts(data));

	// Filter blogs based on current state
	const filteredBlogs = $derived(
		filterBlogs(data, state.search, state.selectedTags, state.viewMode)
	);

	// Get series and standalone posts from filtered results
	const series = $derived(getSeries(filteredBlogs));
	const standalonePosts = $derived(getStandalonePosts(filteredBlogs));

	// For "all" view, we want to show series cards + standalone posts
	// For "series" view, show only series
	// For "standalone" view, show only standalone posts
	const showSeries = $derived(state.viewMode === 'all' || state.viewMode === 'series');
	const showStandalone = $derived(state.viewMode === 'all' || state.viewMode === 'standalone');

	const hasResults = $derived(
		(showSeries && series.length > 0) || (showStandalone && standalonePosts.length > 0)
	);
</script>

<section class="flex flex-col gap-6">
	<!-- Filters -->
	{#if !loading}
		<BlogFilters tags={allTags} {tagCounts} />
		<BlogActiveFilters resultCount={filteredBlogs.length} />
	{/if}

	<!-- Content -->
	{#if loading}
		<div class="flex flex-col gap-4">
			<BlogSkeleton />
			<BlogSkeleton />
		</div>
	{:else if !hasResults}
		<NoResults onClear={() => state.clearAll()} />
	{:else}
		<div class="flex flex-col gap-8">
			<!-- Series Section -->
			{#if showSeries && series.length > 0}
				<div class="flex flex-col gap-4">
					{#if state.viewMode === 'all'}
						<h2 class="font-incognito text-2xl font-bold tracking-tight">Article Series</h2>
					{/if}
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						{#each series as s (s.slug)}
							<SeriesCard series={s} />
						{/each}
					</div>
				</div>
			{/if}

			<!-- Standalone Posts Section -->
			{#if showStandalone && standalonePosts.length > 0}
				<div class="flex flex-col gap-4">
					{#if state.viewMode === 'all' && series.length > 0}
						<h2 class="font-incognito text-2xl font-bold tracking-tight">Single Articles</h2>
					{/if}
					<div class="flex flex-col gap-4">
						{#each standalonePosts as article (article.slug)}
							<BlogCard {article} />
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</section>
