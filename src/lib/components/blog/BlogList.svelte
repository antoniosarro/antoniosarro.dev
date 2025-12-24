<script lang="ts">
	import BlogCard from './BlogCard.svelte';
	import BlogSkeleton from './BlogSkeleton.svelte';

	import type { Blog as BlogType } from '$lib/types/blog';

	interface Props {
		data?: BlogType[];
		loading: boolean;
		recent?: boolean;
	}

	let { data = [], loading, recent = false }: Props = $props();

	let filtered = $derived(recent ? data.slice(0, 2) : data);
</script>

<section id="articles">
	<div class="flex flex-col gap-4">
		{#if loading}
			<BlogSkeleton />
		{:else}
			{#each filtered as article (article.slug)}
				<BlogCard {article} />
			{/each}
		{/if}
	</div>
</section>
