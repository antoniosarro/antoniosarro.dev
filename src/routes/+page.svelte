<script lang="ts">
	import Open from '~icons/majesticons/open';

	import { resolve } from '$app/paths';

	import { calculateAge } from '$lib/utils/date';

	import { Hero, Socials } from '$lib/components/home';
	import { Contributions, ContributionsSkeleton } from '$lib/components/home/contributions';
	import { ProjectList } from '$lib/components/projects';
	import { Metadata } from '$lib/components/shared';

	import { getGithubProjects } from '$lib/services/github/repositories/index.remote';
	import { getGithubContributions } from '$lib/services/github/contribution/index.remote';
	import { getBlogs } from '$lib/services/blog/index.remote';
	import { BlogList } from '$lib/components/blog';

	const contributions = getGithubContributions();
	const projects = getGithubProjects();
	const blogs = getBlogs();
</script>

<Metadata />

<main class="mx-auto mt-20 max-w-7xl px-6 md:px-16 lg:mt-32">
	<section
		class="mb-5 flex flex-col items-start justify-between gap-x-12 xl:flex-row xl:items-center"
	>
		<div class="max-w-2xl lg:max-w-2xl">
			<h1
				class=" mb-6 min-w-full font-incognito text-3xl font-semibold tracking-tight sm:text-5xl lg:min-w-[700px] lg:leading-[3.7rem]"
			>
				Software Engineer & Blogger<br />Open-Source Enthusiast
			</h1>
			<div class="flex flex-col gap-2 text-justify">
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
	<section class="mb-10 flex flex-col gap-4">
		<h2 class="font-incognito text-4xl font-bold tracking-tight">Contribution Graph</h2>
		{#await contributions}
			<ContributionsSkeleton />
		{:then data}
			<Contributions {data} />
		{/await}
	</section>
	<section id="projects" class="mb-10 flex flex-col gap-4">
		<h2 class="font-incognito text-4xl font-bold tracking-tight">Recent Projects</h2>
		<div>
			{#await projects}
				<ProjectList loading={true} />
			{:then data}
				<ProjectList {data} loading={false} recent={true} />
			{/await}
		</div>
		<div class="ml-auto">
			<a
				href={resolve('/projects')}
				class="flex items-center justify-center gap-1 rounded-md border border-elevation-one bg-primary px-2 py-1 text-base text-background"
			>
				More Projects <Open height={18} width={18} />
			</a>
		</div>
	</section>
	<section id="blogs" class="flex flex-col gap-4">
		<h2 class="font-incognito text-4xl font-bold tracking-tight">Latest Blogs</h2>
		<div>
			{#await blogs}
				<BlogList loading={true} />
			{:then data}
				<BlogList {data} loading={false} recent={true} />
			{/await}
		</div>
		<div class="ml-auto">
			<a
				href={resolve('/blogs')}
				class="flex items-center justify-center gap-1 rounded-md border border-elevation-one bg-primary px-2 py-1 text-base text-background"
			>
				More Articles <Open height={18} width={18} />
			</a>
		</div>
	</section>
</main>
