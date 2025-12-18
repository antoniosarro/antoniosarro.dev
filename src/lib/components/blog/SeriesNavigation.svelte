<script lang="ts">
	import Arrow from '~icons/solar/arrow-right-linear';
	import ArrowLeft from '~icons/solar/arrow-left-linear';
	import Book from '~icons/solar/book-2-bold';
	import Check from '~icons/solar/check-circle-bold';

	import type { Series } from '$lib/types/blog';
	import { resolve } from '$app/paths';

	interface Props {
		series: Series;
		currentSlug: string;
	}

	const { series, currentSlug }: Props = $props();

	const currentIndex = $derived(series.posts.findIndex((p) => p.slug === currentSlug));
	const prevPost = $derived(currentIndex > 0 ? series.posts[currentIndex - 1] : null);
	const nextPost = $derived(
		currentIndex < series.posts.length - 1 ? series.posts[currentIndex + 1] : null
	);
</script>

<aside class="overflow-hidden rounded-xl border border-elevation-one">
	<!-- Series Header -->
	<div class="flex items-center gap-3 border-b border-elevation-one bg-elevation-one/30 px-4 py-3">
		<Book class="size-5 shrink-0 text-primary" />
		<div class="flex min-w-0 flex-col">
			<span class="text-xs font-medium tracking-wider text-accent uppercase">Series</span>
			<span class="truncate font-incognito font-semibold text-foreground">{series.title}</span>
		</div>
		<span
			class="ml-auto shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-primary"
		>
			{currentIndex + 1}/{series.totalPosts}
		</span>
	</div>

	<!-- Posts List -->
	<div class="flex flex-col divide-y divide-elevation-one">
		{#each series.posts as post, index (post.slug)}
			{@const isCurrent = post.slug === currentSlug}
			{@const isPast = index < currentIndex}
			<a
				href={resolve(`/blogs/${post.slug}`)}
				class="group flex items-center gap-3 px-4 py-3 duration-200 {isCurrent
					? 'bg-primary/5'
					: 'hover:bg-elevation-one/50'}"
				data-sveltekit-noscroll
			>
				<span
					class="flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium {isCurrent
						? 'bg-primary text-background'
						: isPast
							? 'bg-primary/20 text-primary'
							: 'bg-elevation-one text-accent'}"
				>
					{#if isPast}
						<Check class="size-3.5" />
					{:else}
						{index + 1}
					{/if}
				</span>
				<span
					class="min-w-0 truncate text-sm {isCurrent
						? 'font-medium text-primary'
						: 'text-foreground/80 group-hover:text-foreground'}"
				>
					{post.frontmatter.title}
				</span>
			</a>
		{/each}
	</div>

	<!-- Navigation Buttons -->
	{#if prevPost || nextPost}
		<div class="flex items-stretch divide-x divide-elevation-one border-t border-elevation-one">
			{#if prevPost}
				<a
					href={resolve(`/blogs/${prevPost.slug}`)}
					class="flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-accent duration-200 hover:bg-elevation-one/50 hover:text-foreground"
				>
					<ArrowLeft class="size-4" />
					<span>Previous</span>
				</a>
			{:else}
				<div class="flex-1"></div>
			{/if}

			{#if nextPost}
				<a
					href={resolve(`/blogs/${nextPost.slug}`)}
					class="flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-primary duration-200 hover:bg-primary/5"
				>
					<span>Next</span>
					<Arrow class="size-4" />
				</a>
			{:else}
				<div class="flex-1"></div>
			{/if}
		</div>
	{/if}
</aside>
