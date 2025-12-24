<script lang="ts">
	import ArrowLeft from '~icons/solar/arrow-left-linear';
	import Arrow from '~icons/solar/arrow-right-linear';
	import Book from '~icons/solar/book-2-bold';
	import Check from '~icons/solar/check-circle-bold';

	import { resolve } from '$app/paths';

	import type { Series } from '$lib/types/blog';

	interface Props {
		series: Series;
		currentSlug: string;
	}

	const { series, currentSlug }: Props = $props();

	const currentIndex = $derived(
		series.posts.findIndex((p) => p.slug === currentSlug)
	);
	const prevPost = $derived(
		currentIndex > 0 ? series.posts[currentIndex - 1] : null
	);
	const nextPost = $derived(
		currentIndex < series.posts.length - 1
			? series.posts[currentIndex + 1]
			: null
	);
</script>

<aside class="border-elevation-one overflow-hidden rounded-xl border">
	<!-- Series Header -->
	<div
		class="border-elevation-one bg-elevation-one/30 flex items-center gap-3 border-b px-4 py-3">
		<Book class="text-primary size-5 shrink-0" />
		<div class="flex min-w-0 flex-col">
			<span class="text-accent text-xs font-medium tracking-wider uppercase">
				Series
			</span>
			<span class="font-incognito text-foreground truncate font-semibold">
				{series.title}
			</span>
		</div>
		<span
			class="bg-primary/10 text-primary ml-auto shrink-0 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap">
			{currentIndex + 1}/{series.totalPosts}
		</span>
	</div>

	<!-- Posts List -->
	<div class="divide-elevation-one flex flex-col divide-y">
		{#each series.posts as post, index (post.slug)}
			{@const isCurrent = post.slug === currentSlug}
			{@const isPast = index < currentIndex}
			<a
				href={resolve(`/blogs/${post.slug}`)}
				class="group flex items-center gap-3 px-4 py-3 duration-200 {isCurrent
					? 'bg-primary/5'
					: 'hover:bg-elevation-one/50'}"
				data-sveltekit-noscroll>
				<span
					class="flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium {isCurrent
						? 'bg-primary text-background'
						: isPast
							? 'bg-primary/20 text-primary'
							: 'bg-elevation-one text-accent'}">
					{#if isPast}
						<Check class="size-3.5" />
					{:else}
						{index + 1}
					{/if}
				</span>
				<span
					class="min-w-0 truncate text-sm {isCurrent
						? 'text-primary font-medium'
						: 'text-foreground/80 group-hover:text-foreground'}">
					{post.frontmatter.title}
				</span>
			</a>
		{/each}
	</div>

	<!-- Navigation Buttons -->
	{#if prevPost || nextPost}
		<div
			class="divide-elevation-one border-elevation-one flex items-stretch divide-x border-t">
			{#if prevPost}
				<a
					href={resolve(`/blogs/${prevPost.slug}`)}
					class="text-accent hover:bg-elevation-one/50 hover:text-foreground flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium duration-200">
					<ArrowLeft class="size-4" />
					<span>Previous</span>
				</a>
			{:else}
				<div class="flex-1"></div>
			{/if}

			{#if nextPost}
				<a
					href={resolve(`/blogs/${nextPost.slug}`)}
					class="text-primary hover:bg-primary/5 flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium duration-200">
					<span>Next</span>
					<Arrow class="size-4" />
				</a>
			{:else}
				<div class="flex-1"></div>
			{/if}
		</div>
	{/if}
</aside>
