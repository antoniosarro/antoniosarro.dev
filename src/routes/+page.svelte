<script lang="ts">
	import { Hero, Socials } from '$components/home';
	import { Contributions, ContributionsSkeleton } from '$components/home/Contributions';
	import { Blogs } from '$components/shared/blog';
	import { Metadata } from '$components/shared/misc';
	import { Projects } from '$components/shared/project';
	import type { Blog } from '$types/blog';
	import type { Result } from '$types/contributions';
	import type { RepositoryInfo } from '$types/github/types';
	import { calculateAge } from '$utils/date';

	const {
		data
	}: {
		data: {
			github: Promise<{
				[key: string]: Result;
			}>;
			projects: Promise<RepositoryInfo[]>;
			articles: Promise<Blog[]>;
		};
	} = $props();
</script>

<Metadata />

<main class="mx-auto mt-20 max-w-7xl px-6 md:px-16 lg:mt-32">
	<!-- HERO -->
	<section
		class="mb-5 flex flex-col items-start justify-between gap-x-12 xl:flex-row xl:items-center"
	>
		<div class="max-w-2xl lg:max-w-2xl">
			<h1
				class="mb-6 min-w-full font-incognito text-3xl font-semibold leading-tight tracking-tight sm:text-5xl lg:min-w-[700px] lg:leading-[3.7rem]"
			>
				Software Engineer & Blogger<br />Open-Source Enthusiast
			</h1>
			<div class="flex flex-col gap-2">
				<p class="text-base leading-relaxed text-accent">
					Hi, I'm <span class="font-semibold text-primary">Antonio</span>, a {calculateAge(
						new Date('1999-11-16')
					)}-year-old software engineer with a lifelong
					<span class="font-semibold text-primary">passion</span>
					for IT. I'm always seeking new challenges and opportunities to learn.
				</p>
				<p class="text-base leading-relaxed text-accent">
					I actively contribute to the open-source community. I'm based in
					<span class="font-semibold text-primary">Italy</span> and enjoy the continuous pursuit of self-improvement.
				</p>
			</div>
			<Socials />
		</div>
		<Hero />
	</section>
	<!-- CONTRIBUTION -->
	<section class="mb-10 flex flex-col gap-4">
		<h2 class="font-incognito text-4xl font-bold tracking-tight">Contribution Graph</h2>
		{#await data.github}
			<ContributionsSkeleton />
		{:then github}
			<Contributions {github} />
		{/await}
	</section>
	<!-- PROJECTS -->
	<section id="projects" class="mb-10 flex flex-col gap-4">
		<h2 class="font-incognito text-4xl font-bold tracking-tight">Recent Projects</h2>
		<div>
			{#await data.projects}
				<Projects loading={true} />
			{:then projects}
				<Projects {projects} loading={false} recent={true} />
			{/await}
		</div>
		<div class="ml-auto">
			<a
				href="/projects"
				class="flex flex-row gap-1 rounded-md border border-elevation-one bg-primary px-2 py-1 text-base text-background"
			>
				More Projects <iconify-icon
					noobserver
					height="18"
					width="18"
					class="flex"
					icon="majesticons:open"
				></iconify-icon>
			</a>
		</div>
	</section>
	<!-- BLOGS -->
	<section id="blogs" class="flex flex-col gap-4">
		<h2 class="font-incognito text-4xl font-bold tracking-tight">Latest Blogs</h2>
		<div>
			{#await data.articles}
				<Blogs loading={true} />
			{:then articles}
				<Blogs {articles} loading={false} recent={true} />
			{/await}
		</div>
		<div class="ml-auto">
			<a
				href="/blog"
				class="flex flex-row gap-1 rounded-md border border-elevation-one bg-primary px-2 py-1 text-base text-background"
			>
				More Articles<iconify-icon
					noobserver
					height="18"
					width="18"
					class="flex"
					icon="majesticons:open"
				></iconify-icon>
			</a>
		</div>
	</section>
</main>
