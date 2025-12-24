<script lang="ts">
	import { BlogListWithFilters } from '$lib/components/blog';
	import { Metadata } from '$lib/components/shared';
	import { getBlogs } from '$lib/services/blog/index.remote';
	import { setBlogFilterState } from '$lib/stores/blog.svelte';

	const blogs = getBlogs();

	setBlogFilterState();
</script>

<Metadata />

<section class="mx-auto max-w-7xl px-6 md:px-16">
	<header class="mb-10">
		<h1
			class="font-incognito mb-5 text-3xl font-semibold tracking-tight sm:text-5xl">
			Blog
		</h1>
		<p class="text-accent mb-4 text-base leading-relaxed">
			Welcome to my blog! Join me as I share what I've learned, the projects I'm
			working on, and other interesting discoveries.
		</p>
	</header>

	{#await blogs}
		<BlogListWithFilters loading={true} />
	{:then data}
		<BlogListWithFilters {data} loading={false} />
	{/await}
</section>
