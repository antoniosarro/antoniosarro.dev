<script lang="ts">
	import Arrow from '~icons/solar/arrow-right-linear';
	import Book from '~icons/solar/book-2-bold';

	import { resolve } from '$app/paths';

	import type { Series } from '$lib/types/blog';

	interface Props {
		series: Series;
	}

	const { series }: Props = $props();

	const postsText = $derived(series.totalPosts === 1 ? 'article' : 'articles');
	const firstPost = $derived(series.posts[0]);
</script>

<div
	class="group border-elevation-one from-background to-elevation-one/30 hover:border-primary hover:shadow-primary/5 relative flex flex-col overflow-hidden rounded-xl border bg-linear-to-br transition-all duration-300 hover:shadow-lg">
	<!-- Series Header -->
	<div class="relative flex flex-col gap-4 p-6">
		<!-- Badge -->
		<div class="flex items-center gap-2">
			<span
				class="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
				<Book class="size-3.5" />
				Series
			</span>
			<span class="text-accent text-sm">
				{series.totalPosts}
				{postsText}
			</span>
		</div>

		<!-- Title & Description -->
		<div class="flex flex-col gap-2">
			<h3
				class="font-incognito text-foreground text-xl font-bold tracking-tight">
				{series.title}
			</h3>
			<p class="text-accent line-clamp-2 text-sm leading-relaxed">
				{series.description}
			</p>
		</div>
	</div>

	<!-- Posts Preview -->
	<div
		class="border-elevation-one bg-elevation-one/20 flex flex-col gap-1 border-t px-6 py-4">
		<span class="text-accent mb-2 text-xs font-medium tracking-wider uppercase">
			Articles in this series
		</span>
		<ul class="flex flex-col gap-1.5">
			{#each series.posts.slice(0, 3) as post, index (post.slug)}
				<li>
					<a
						href={resolve(`/blogs/[slug]`, {
							slug: post.slug
						})}
						class="group/item text-foreground/80 hover:text-primary flex items-center gap-2 text-sm duration-200">
						<span
							class="bg-elevation-one flex size-5 shrink-0 items-center justify-center rounded text-xs font-medium">
							{index + 1}
						</span>
						<span class="truncate">{post.frontmatter.title}</span>
						<Arrow
							class="ml-auto size-3.5 shrink-0 opacity-0 transition-opacity duration-200 group-hover/item:opacity-100" />
					</a>
				</li>
			{/each}
			{#if series.posts.length > 3}
				<li class="text-accent mt-1 text-xs">
					+{series.posts.length - 3} more articles
				</li>
			{/if}
		</ul>
	</div>

	<a
		href={resolve(`/blogs/[slug]`, {
			slug: firstPost.slug
		})}
		class="border-elevation-one text-primary hover:bg-primary/5 flex items-center justify-between border-t px-6 py-4 text-sm font-medium duration-200">
		<span>Start reading</span>
		<Arrow
			class="size-4 transition-transform duration-200 group-hover:translate-x-1" />
	</a>
</div>
