<script lang="ts">
	import 'iconify-icon';

	import Giscus from '@giscus/svelte';

	import { BuyMeCoffee, Metadata, ShareArticle } from '$components/shared/misc';
	import { env } from '$env/dynamic/public';
	import profile from '$lib/assets/images/profile.webp';
	import { darkMode } from '$lib/stores/dark.svelte';
	import { formatDateFull } from '$lib/utils/date';

	const { data } = $props();
	let { Content, frontmatter, slug } = data;
</script>

<Metadata {frontmatter} {slug} />

{#if frontmatter}
	<main>
		<header class="flex items-center gap-x-2 border-b border-elevation-one pb-4">
			<a href="/blog" class="whitespace-nowrap text-sm duration-300 hover:text-primary"> cd .. </a>
			<iconify-icon noobserver icon="weui:arrow-filled"></iconify-icon>
			<p class="truncate text-sm">{frontmatter.title}</p>
		</header>
		<article>
			<div class="relative grid grid-cols-1">
				<div class="min-h-full border-r-0 border-elevation-one px-0 pb-4 pt-10">
					<div class="text-md mb-2 flex flex-wrap items-center gap-4">
						<div class="flex items-center gap-x-2">
							<iconify-icon noobserver icon="solar:calendar-bold"></iconify-icon>
							<time datetime={frontmatter.publishedAt}>
								{formatDateFull(frontmatter.publishedAt)}
							</time>
						</div>
						<div class="flex items-center gap-x-2">
							<iconify-icon noobserver icon="mingcute:time-fill"></iconify-icon>
							<div>{frontmatter.readingTime.text}</div>
						</div>
					</div>

					<a class="mb-4 flex items-center gap-x-2 text-primary" href="#comments">
						<iconify-icon noobserver icon="eva:message-circle-outline"></iconify-icon>
						<div class="#comments">Comments</div>
					</a>

					<header class="mb-10">
						<h1 class="mb-2 max-w-3xl font-incognito text-3xl font-semibold tracking-tight">
							{frontmatter.title}
						</h1>
						<p class="max-w-2xl text-base leading-relaxed text-accent">{frontmatter.description}</p>
					</header>

					<div class="relative w-full">
						<img
							class="rounded-xl border border-elevation-one object-cover"
							src={frontmatter.image}
							alt={frontmatter.title}
						/>
					</div>

					<div class="mdsvex mt-8 text-lg leading-relaxed tracking-tight">
						<Content />
					</div>
				</div>

				<aside class="sticky bottom-auto right-0 top-2 flex h-max flex-col gap-y-8 px-0 py-10">
					<section class="border-b border-elevation-one pb-10">
						<p class="text-sm text-primary">Written By</p>
						<address class="mt-4 flex items-center gap-x-3 not-italic">
							<div class="relative h-12 w-12">
								<img
									class="rounded-full object-cover"
									width={80}
									height={80}
									src={profile}
									alt={'Antonio Sarro'}
								/>
							</div>
							<div>
								<h3 class="text-lg font-semibold tracking-tight">Antonio Sarro</h3>
								<a href={''} class="text-sm text-primary" rel="noreferrer noopener" target="_blank">
									{`@antoniosarro`}
								</a>
							</div>
						</address>
					</section>

					<section class="border-b border-elevation-one pb-10">
						<h3 class="mb-4 text-xl font-semibold tracking-tight">Tags</h3>
						<ul class="flex flex-wrap items-center gap-2 tracking-tight">
							{#each frontmatter.tags as tag}
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

		<section id="comments" class="border-elevation-one pt-0">
			<h3 class="mb-8 text-3xl font-semibold tracking-tight">Comments</h3>
			<Giscus
				id="comments"
				repo="antoniosarro/antoniosarro.dev"
				repoId={env.PUBLIC_GISCUS_REPO_ID}
				category="Announcements"
				categoryId={env.PUBLIC_GISCUS_CATEGORY_ID}
				mapping="title"
				reactionsEnabled="1"
				emitMetadata="0"
				inputPosition="bottom"
				theme={$darkMode ? 'transparent_dark' : 'light'}
				lang="en"
				loading="lazy"
				term="Welcome to @giscus/svelte component!"
			/>
		</section>

		<section class="py-10">
			<h3 class="mb-8 text-3xl font-semibold tracking-tight">Support</h3>
			<BuyMeCoffee />
		</section>
	</main>
{/if}
