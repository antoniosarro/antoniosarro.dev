<script lang="ts">
	import BlogSearch from './BlogSearch.svelte';
	import BlogTagFilter from './BlogTagFilter.svelte';
	import BlogViewToggle from './BlogViewToggle.svelte';

	interface Props {
		tags: string[];
		tagCounts?: Map<string, number>;
	}

	let { tags, tagCounts }: Props = $props();
</script>

<div class="flex flex-col gap-6">
	<!-- Search and View Toggle Row -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center">
		<div class="flex-1">
			<BlogSearch />
		</div>
		<BlogViewToggle />
	</div>

	<!-- Tag Filter -->
	{#if tags.length > 0}
		<BlogTagFilter {tags} {tagCounts} />
	{/if}
</div>
