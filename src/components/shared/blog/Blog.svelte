<script lang="ts">
	import 'iconify-icon';

	import type { Blog } from '$types/blog';
	import { formatDateFull } from '$utils/date';

	const { article }: { article: Blog } = $props();
</script>

<a
	href="/blog/{article.slug}"
	class="group flex flex-col items-start gap-4 rounded-lg border border-elevation-one p-6 lg:flex-row lg:items-center"
>
	<div class="relative h-56 w-full overflow-clip lg:h-52 lg:min-w-[400px] lg:max-w-[400px]">
		<img
			class="rounded-md object-cover duration-300 group-hover:scale-125"
			src={article.frontmatter.image}
			alt={article.frontmatter.title}
		/>
	</div>
	<div class="flex flex-col gap-2">
		<div class="flex flex-row gap-2">
			{#each article.frontmatter.tags as tag}
				<div class="rounded-md border border-elevation-one bg-elevation-one px-1 py-0.5">
					{tag}
				</div>
			{/each}
		</div>
		<h2 class="font-incognito text-2xl font-semibold tracking-tight">
			{article.frontmatter.title}
		</h2>
		<p class="text-[0.95rem]">
			{article.frontmatter.description}
		</p>
		<div class="flex items-center gap-x-4 text-sm">
			<div class="flex items-center gap-x-2">
				<iconify-icon noobserver icon="solar:calendar-bold"></iconify-icon>
				<time>{formatDateFull(article.frontmatter.publishedAt)}</time>
			</div>
			<div class="flex items-center gap-x-2">
				<iconify-icon noobserver icon="mingcute:time-fill"></iconify-icon>
				<div>{article.frontmatter.readingTime.text}</div>
			</div>
			{#if article.views !== undefined}
				<div class="flex items-center gap-x-2">
					<iconify-icon noobserver icon="solar:eye-outline"></iconify-icon>
					<div>{article.views} {article.views === 1 ? 'view' : 'views'}</div>
				</div>
			{/if}
		</div>
	</div>
</a>
