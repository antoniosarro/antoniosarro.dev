<script lang="ts">
	import Book from '~icons/solar/book-2-bold';
	import Arrow from '~icons/solar/arrow-right-linear';

	import type { Series } from '$lib/types/blog';
	import { resolve } from '$app/paths';

	interface Props {
		series: Series;
	}

	const { series }: Props = $props();

	const postsText = $derived(series.totalPosts === 1 ? 'article' : 'articles');
	const firstPost = $derived(series.posts[0]);
</script>

<div
	class="group relative flex flex-col overflow-hidden rounded-xl border border-elevation-one bg-linear-to-br from-background to-elevation-one/30 transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/5"
>
	<!-- Series Header -->
	<div class="relative flex flex-col gap-4 p-6">
		<!-- Badge -->
		<div class="flex items-center gap-2">
			<span
				class="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
			>
				<Book class="size-3.5" />
				Series
			</span>
			<span class="text-sm text-accent">
				{series.totalPosts}
				{postsText}
			</span>
		</div>

		<!-- Title & Description -->
		<div class="flex flex-col gap-2">
			<h3 class="font-incognito text-xl font-bold tracking-tight text-foreground">
				{series.title}
			</h3>
			<p class="line-clamp-2 text-sm leading-relaxed text-accent">
				{series.description}
			</p>
		</div>
	</div>

	<!-- Posts Preview -->
	<div class="flex flex-col gap-1 border-t border-elevation-one bg-elevation-one/20 px-6 py-4">
		<span class="mb-2 text-xs font-medium tracking-wider text-accent uppercase">
			Articles in this series
		</span>
		<ul class="flex flex-col gap-1.5">
			{#each series.posts.slice(0, 3) as post, index (post.slug)}
				<li>
					<a
						href={resolve(`/blogs/[slug]`, {
							slug: post.slug
						})}
						class="group/item flex items-center gap-2 text-sm text-foreground/80 duration-200 hover:text-primary"
					>
						<span
							class="flex size-5 shrink-0 items-center justify-center rounded bg-elevation-one text-xs font-medium"
						>
							{index + 1}
						</span>
						<span class="truncate">{post.frontmatter.title}</span>
						<Arrow
							class="ml-auto size-3.5 shrink-0 opacity-0 transition-opacity duration-200 group-hover/item:opacity-100"
						/>
					</a>
				</li>
			{/each}
			{#if series.posts.length > 3}
				<li class="mt-1 text-xs text-accent">
					+{series.posts.length - 3} more articles
				</li>
			{/if}
		</ul>
	</div>

	<a
		href={resolve(`/blogs/[slug]`, {
			slug: firstPost.slug
		})}
		class="flex items-center justify-between border-t border-elevation-one px-6 py-4 text-sm font-medium text-primary duration-200 hover:bg-primary/5"
	>
		<span>Start reading</span>
		<Arrow class="size-4 transition-transform duration-200 group-hover:translate-x-1" />
	</a>
</div>
