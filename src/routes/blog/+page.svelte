<script lang="ts">
	import { Blogs } from '$components/shared/blog';
	import { Metadata } from '$components/shared/misc';
	import type { Blog } from '$types/blog';

	const {
		data
	}: {
		data: {
			articles: Promise<Blog[]>;
		};
	} = $props();
</script>

<Metadata />

<section class="mx-auto max-w-7xl px-6 md:px-16">
	<header class="mb-10">
		<h1 class="mb-5 font-incognito text-3xl font-semibold tracking-tight sm:text-5xl">Blog</h1>
		<p class="mb-4 text-base leading-relaxed text-accent">
			Welcome to my blog! Join me as I share what I've learned, the projects I'm working on, and
			other interesting discoveries.
		</p>
	</header>
	{#await data.articles}
		<Blogs loading={true} />
	{:then articles}
		<Blogs {articles} loading={false} recent={false} />
	{/await}
</section>
