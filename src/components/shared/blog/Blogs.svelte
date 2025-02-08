<script lang="ts">
	import type { Blog as BlogType } from '$types/blog';

	import Blog from './Blog.svelte';
	import SkeletonBlog from './BlogSkeleton.svelte';

	let {
		articles = [],
		loading,
		recent
	}: { articles?: BlogType[]; loading: boolean; recent?: boolean } = $props();

	let filtered = $derived.by(() => {
		if (recent) {
			return articles.slice(0, 2);
		} else {
			return articles;
		}
	});
</script>

<section id="articles">
	<div class="flex flex-col gap-4">
		{#if !loading}
			{#each filtered as article}
				{#if article}
					<Blog {article} />
				{/if}
			{/each}
		{:else}
			<SkeletonBlog />
		{/if}
	</div>
</section>
