<script lang="ts">
	import Calendar from '~icons/solar/calendar-bold';
	import Time from '~icons/mingcute/time-fill';
	import Eye from '~icons/solar/eye-outline';

	import type { Blog } from '$lib/types/blog';
	import { formatDateFull } from '$lib/utils/date';
	import { resolve } from '$app/paths';
	import { OptimizedImage } from '../shared';

	interface Props {
		article: Blog;
	}

	const { article }: Props = $props();

	const { frontmatter, slug, views } = $derived(article);
	const viewsText = $derived(views === 1 ? 'view' : 'views');
</script>

<a
	href={resolve(`/blogs/${slug}`)}
	class="group flex flex-col items-start gap-4 rounded-lg border border-elevation-one p-6 lg:flex-row lg:items-center"
>
	<div
		class="relative h-56 w-full overflow-clip rounded-md lg:h-52 lg:max-w-[400px] lg:min-w-[400px]"
	>
		<OptimizedImage
			src={frontmatter.image || ''}
			alt={frontmatter.title}
			class="size-full object-cover duration-300 group-hover:scale-125"
		/>
	</div>

	<div class="flex flex-col gap-2">
		{#if frontmatter.tags.length > 0}
			<div class="flex flex-row flex-wrap gap-2">
				{#each frontmatter.tags as tag (tag)}
					<span class="rounded-md border border-elevation-one bg-elevation-one px-1 py-0.5">
						{tag}
					</span>
				{/each}
			</div>
		{/if}

		<h2 class="font-incognito text-2xl font-semibold tracking-tight">
			{frontmatter.title}
		</h2>

		<p class="text-[0.95rem]">
			{frontmatter.description}
		</p>

		<div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
			<div class="flex items-center gap-x-2">
				<Calendar />
				<time datetime={frontmatter.publishedAt}>
					{formatDateFull(frontmatter.publishedAt)}
				</time>
			</div>

			<div class="flex items-center gap-x-2">
				<Time />
				<span>{frontmatter.readingTime.text}</span>
			</div>

			{#if views !== undefined}
				<div class="flex items-center gap-x-2">
					<Eye />
					<span>{views} {viewsText}</span>
				</div>
			{/if}
		</div>
	</div>
</a>
