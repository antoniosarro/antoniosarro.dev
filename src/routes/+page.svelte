<script lang="ts">
	import { Hero, Socials } from '$components/home';
	import { Contributions } from '$components/home/Contributions';
	import { calculateAge } from '$utils/date';
	import type { Result } from '$types/github';

	const {
		data
	}: {
		data: {
			github: Promise<{
				[key: string]: Result;
			}>;
		};
	} = $props();
</script>

<main class="mx-auto mt-14 max-w-7xl px-6 md:px-16 lg:mt-24">
	<section
		class="mb-10 flex flex-col items-start justify-between gap-x-12 lg:flex-row xl:items-center xl:justify-center"
	>
		<div class="max-w-2xl">
			<h1
				class="mb-6 min-w-full font-incognito text-3xl font-semibold leading-tight tracking-tight sm:text-5xl lg:min-w-[700px] lg:leading-[3.7rem]"
			>
				Software Engineer & Blogger<br />Open-Source Enthusiast
			</h1>
			<p class="mb-5 text-base leading-relaxed text-accent">
				Hi, I'm <span class="font-semibold text-primary">Antonio</span>, a {calculateAge(
					new Date('1999-11-16')
				)}-year-old software engineer with a lifelong
				<span class="font-semibold text-primary">passion</span>
				for IT. I'm always seeking new challenges and opportunities to learn. I actively contribute to
				the open-source community. I'm based in
				<span class="font-semibold text-primary">Italy</span> and enjoy the continuous pursuit of self-improvement.
			</p>
			<Socials />
		</div>
		<Hero />
	</section>
	<section>
		<h2 class="mb-4 font-incognito text-3xl font-bold tracking-tight sm:text-4xl">
			Contribution Graph
		</h2>
		{#await data.github}
			<h1>Loading github contributions</h1>
		{:then github}
			<Contributions {github} />
		{/await}
	</section>
</main>
