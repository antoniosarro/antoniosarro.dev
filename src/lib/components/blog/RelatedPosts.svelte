<script lang="ts">
	import Arrow from '~icons/solar/arrow-right-linear';
	import type { Blog } from '$lib/types/blog';
	import { resolve } from '$app/paths';
	import { formatDateFull } from '$lib/utils/date';
	import { OptimizedImage } from '../shared';

	interface Props {
		posts: Blog[];
	}

	let { posts }: Props = $props();
</script>

{#if posts.length > 0}
	<section class="border-t border-elevation-one pt-10">
		<h3 class="mb-6 font-incognito text-2xl font-semibold tracking-tight">Related Articles</h3>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each posts as post (post.slug)}
				<a
					href={resolve(`/blogs/${post.slug}`)}
					class="group flex flex-col overflow-hidden rounded-lg border border-elevation-one transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/5"
				>
					{#if post.frontmatter.image}
						<div class="relative h-32 overflow-hidden">
							<OptimizedImage
								src={post.frontmatter.image}
								alt={post.frontmatter.title}
								class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
							/>
						</div>
					{/if}
					<div class="flex flex-1 flex-col gap-2 p-4">
						<div class="flex flex-wrap gap-1">
							{#each post.frontmatter.tags.slice(0, 2) as tag (tag)}
								<span class="rounded bg-elevation-one px-1.5 py-0.5 text-xs">
									{tag}
								</span>
							{/each}
						</div>
						<h4
							class="line-clamp-2 font-incognito text-lg font-semibold tracking-tight group-hover:text-primary"
						>
							{post.frontmatter.title}
						</h4>
						<p class="line-clamp-2 text-sm text-accent">
							{post.frontmatter.description}
						</p>
						<div class="mt-auto flex items-center justify-between pt-2 text-xs text-accent">
							<time datetime={post.frontmatter.publishedAt}>
								{formatDateFull(post.frontmatter.publishedAt)}
							</time>
							<span
								class="flex items-center gap-1 text-primary opacity-0 transition-opacity group-hover:opacity-100"
							>
								Read more
								<Arrow class="size-3" />
							</span>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</section>
{/if}
