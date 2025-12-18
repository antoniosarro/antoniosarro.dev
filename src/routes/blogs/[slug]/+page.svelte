<script lang="ts">
	import Arrow from '~icons/weui/arrow-filled';
	import Calendar from '~icons/solar/calendar-bold';
	import Time from '~icons/mingcute/time-fill';
	import Message from '~icons/eva/message-circle-outline';

	import Giscus from '@giscus/svelte';
	import { PUBLIC_GISCUS_REPO_ID, PUBLIC_GISCUS_CATEGORY_ID } from '$env/static/public';

	import { afterNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import {
		Metadata,
		ShareArticle,
		TableOfContent,
		ReadingProgress,
		OptimizedImage
	} from '$lib/components/shared';
	import { SeriesNavigation, RelatedPosts } from '$lib/components/blog';
	import { formatDateFull } from '$lib/utils/date.js';
	import MDXContent from '$lib/components/mdx/MDXContent.svelte';
	import { getSeries, getRelatedPosts } from '$lib/utils/blog';
	import type { PageData } from './$types';
	import { darkMode } from '$lib/stores/theme.svelte';

	let { data }: { data: PageData } = $props();

	const frontmatter = $derived(data.frontmatter);
	const slug = $derived(data.slug);
	const content = $derived(data.content);
	const allBlogs = $derived(data.allBlogs);

	let component = $state<HTMLElement>();

	const series = $derived.by(() => {
		const seriesSlug = frontmatter.series;
		if (!seriesSlug || !allBlogs) return null;
		const allSeries = getSeries(allBlogs);
		return allSeries.find((s) => s.slug === seriesSlug) || null;
	});

	const relatedPosts = $derived(getRelatedPosts(slug, frontmatter.tags, allBlogs, 3));

	afterNavigate(() => {
		window.scrollTo(0, 0);
	});
</script>

<Metadata {frontmatter} {slug} />
<ReadingProgress />

{#if frontmatter}
	<main class="mx-auto max-w-7xl px-6 md:px-16">
		<header class="flex items-center gap-x-2 border-b border-elevation-one pb-8">
			<a href={resolve('/blogs')} class="text-sm whitespace-nowrap duration-300 hover:text-primary">
				cd ..
			</a>
			<Arrow />
			{#if series}
				<span class="text-sm whitespace-nowrap text-accent">
					{series.title}
				</span>
				<Arrow />
			{/if}
			<p class="truncate text-sm">{frontmatter.title}</p>
		</header>

		<article>
			<div class="relative grid grid-cols-1 lg:grid-cols-[75%_25%]">
				<div class="min-h-full border-r-0 border-elevation-one px-0 pt-10 pb-4 lg:border-r lg:pr-6">
					<div class="text-md mb-2 flex flex-wrap items-center gap-4">
						<div class="flex items-center gap-x-2">
							<Calendar />
							<time datetime={frontmatter.publishedAt}>
								{formatDateFull(frontmatter.publishedAt)}
							</time>
						</div>
						<div class="flex items-center gap-x-2">
							<Time />
							<div>{frontmatter.readingTime.text}</div>
						</div>
						<a class="ml-auto hidden items-center gap-x-2 text-primary sm:flex" href="#comments">
							<Message />
							<div>Comments</div>
						</a>
					</div>

					<a class="mb-4 flex items-center gap-x-2 text-primary sm:hidden" href="#comments">
						<Message />
						<div>Comments</div>
					</a>

					<header class="mb-10">
						<h1
							class="mb-2 max-w-3xl font-incognito text-3xl font-semibold tracking-tight sm:text-4xl"
						>
							{frontmatter.title}
						</h1>
						<p class="max-w-2xl text-base leading-relaxed text-accent">{frontmatter.description}</p>
					</header>

					<div class="relative w-full">
						<OptimizedImage
							src={frontmatter.image || ''}
							alt={frontmatter.title}
							class="rounded-xl border border-elevation-one object-cover"
							eager={true}
						/>
					</div>

					<div class="mt-8 text-lg leading-relaxed tracking-tight" bind:this={component}>
						<MDXContent html={content.html} codeBlocks={content.codeBlocks} />
					</div>
				</div>

				<aside
					class="sticky top-2 right-0 bottom-auto flex h-max flex-col gap-y-8 px-0 py-10 lg:max-h-full lg:px-6"
				>
					<!-- Series Navigation (if part of a series) -->
					{#if series}
						<section class="border-b border-elevation-one pb-8">
							<SeriesNavigation {series} currentSlug={slug} />
						</section>
					{/if}

					<section class="hidden border-b border-elevation-one pb-10 lg:block">
						{#if component}
							<TableOfContent html={component.innerHTML} />
						{/if}
					</section>
					<section class="border-b border-elevation-one pb-10">
						<p class="text-sm text-primary">Written By</p>
						<address class="mt-4 flex items-center gap-x-3 not-italic">
							<div class="relative h-12 w-12">
								<OptimizedImage
									src="/images/misc/profile.webp"
									alt="Antonio Sarro"
									class="rounded-full object-cover"
									width={80}
									height={80}
								/>
							</div>
							<div>
								<h3 class="text-lg font-semibold tracking-tight">Antonio Sarro</h3>
								<a
									href={resolve('/')}
									class="text-sm text-primary"
									rel="noreferrer noopener"
									target="_blank"
								>
									@antoniosarro
								</a>
							</div>
						</address>
					</section>
					<section class="border-b border-elevation-one pb-10">
						<h3 class="mb-4 text-xl font-semibold tracking-tight">Tags</h3>
						<ul class="flex flex-wrap items-center gap-2 tracking-tight">
							{#each frontmatter.tags as tag (tag)}
								<li class="rounded-md bg-elevation-one px-2 py-1 text-sm">
									{tag}
								</li>
							{/each}
						</ul>
					</section>
					<ShareArticle description={frontmatter.description} title={frontmatter.title} {slug} />
				</aside>
			</div>
		</article>
		<div class="my-10">
			<RelatedPosts posts={relatedPosts} />
		</div>
		<section id="comments" class="border-elevation-one pt-0 lg:border-t lg:py-10">
			<h3 class="mb-8 font-semibold tracking-tight first-letter:text-3xl lg:text-4xl">Comments</h3>
			<Giscus
				id="comments"
				repo="antoniosarro/antoniosarro.dev"
				repoId={PUBLIC_GISCUS_REPO_ID}
				category="Announcements"
				categoryId={PUBLIC_GISCUS_CATEGORY_ID}
				mapping="title"
				reactionsEnabled="1"
				emitMetadata="0"
				inputPosition="bottom"
				theme={darkMode.value ? 'transparent_dark' : 'light'}
				lang="en"
				loading="lazy"
				term="Welcome to @giscus/svelte component!"
			/>
		</section>

		<!-- <section class="py-10">
			<h3 class="mb-8 text-3xl font-semibold tracking-tight lg:text-4xl">Support</h3>
			<BuyMeCoffee />
		</section> -->
	</main>
{/if}
