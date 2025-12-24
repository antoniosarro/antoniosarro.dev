<script lang="ts">
	import Open from '~icons/majesticons/open';
	import Mail from '~icons/material-symbols/mail';

	import { resolve } from '$app/paths';

	import { TechStackVisualization } from '$lib/components/about';
	import Logo from '$lib/components/layout/navbar/Logo.svelte';
	import { Metadata, OptimizedImage } from '$lib/components/shared';
	import { experiences } from '$lib/data/experiences';
	import { hardSkills } from '$lib/data/hardSkills';
	import { mail } from '$lib/data/socials';
	import { softSkills } from '$lib/data/softskills';
	import { calculateAge, formatDate } from '$lib/utils/date';

	function downloadResume(url: string) {
		const a = document.createElement('a');
		if (!a.click) {
			throw new Error('DownloadResume: "a.click()" is not supported.');
		}
		a.href = url;
		a.target = '_parent';

		if ('download' in a) {
			a.download = url.substring(url.lastIndexOf('/') + 1);
		}

		(document.body || document.documentElement).append(a);
		a.click();
		a.remove();
	}
</script>

<Metadata />

<main class="relative mx-auto max-w-3xl px-6 md:px-16 lg:max-w-7xl">
	<section class="mb-14 flex flex-row items-center justify-between">
		<div class="mb-14 flex flex-col gap-3 lg:basis-2/3">
			<h1
				class="font-incognito text-3xl font-semibold tracking-tight sm:text-5xl lg:leading-tight">
				Hi! I'm Antonio Sarro <span class="wave-emoji">👋🏼</span>
			</h1>
			<p>
				I'm a <span class="text-primary font-bold">
					{calculateAge(new Date('1999-11-16'))}
				</span>
				years old software engineer based in
				<span class="text-primary font-bold">Italy</span>
				. I've always had a strong
				<span class="text-primary font-bold">passion</span>
				and predisposition for hardware and IT since I was a child, which has always
				pushed me to learn and delve deeper into this field.
			</p>

			<p>
				Being a very
				<span class="text-primary font-bold">curious</span>
				person who always wants to discover something new, I like to study and understand
				new technologies for personal of future projects.
			</p>

			<p>
				In my free time, I enjoy listening to <span
					class="text-primary font-bold">
					music
				</span>
				, playing
				<span class="text-primary font-bold">games or chess</span>
				and going to the
				<span class="text-primary font-bold">gym</span>
				.
			</p>
		</div>
		<div class="hidden lg:block">
			<OptimizedImage
				src="/images/misc/profile.webp"
				alt="Antonio Sarro"
				class="mb-4 max-h-72 min-h-72 rounded-2xl bg-top object-cover"
				width={250}
				height={250}
				eager={true} />
			<div class="flex flex-col gap-y-4 text-center">
				<div class="flex items-center gap-x-3">
					<button
						onclick={() => downloadResume('/misc/Antonio_Sarro_CV.pdf')}
						class="flex-center border-elevation-one font-incognito hover:bg-primary hover:text-background flex basis-[90%] items-center justify-center gap-x-2 rounded-md border py-2 text-center text-lg font-semibold duration-500">
						View Resume <Open height={20} width={20} class="flex" />
					</button>
					<a
						class="border-elevation-one hover:bg-primary hover:text-background rounded-md border p-3 duration-500"
						href={mail}
						aria-label="Mail">
						<Mail height={20} width={20} class="flex" />
					</a>
				</div>
			</div>
		</div>
	</section>

	<section id="work" class="mb-14">
		<h2 class="font-incognito mb-3 text-3xl font-bold tracking-tight">
			Work Experience
		</h2>
		<div class="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2">
			{#each experiences as { company, dates, position, descriptions, logo }, i (i)}
				<div
					class="max-2-2xl before:bg-elevation-one relative flex items-start gap-x-4 before:absolute before:top-[5rem] before:bottom-0 before:left-9 before:h-[calc(100%-70px)] before:w-px">
					<a
						href={resolve('/')}
						class="border-elevation-one fill-foreground relative grid min-h-[80px] min-w-[80px] place-items-center overflow-clip rounded-md border p-2">
						{#if logo}
							<OptimizedImage
								src="/images/about/{logo}.webp"
								alt="{company} logo"
								class="object-cover"
								width={50}
								height={50} />
						{:else}
							<Logo />
						{/if}
					</a>
					<div class="flex flex-col items-start">
						<h3 class="text-xl font-semibold">{company}</h3>
						<p class="mb-2">{position}</p>
						<time class="mb-3 text-sm tracking-widest uppercase opacity-70">
							{formatDate(dates[0])} -
							{#if dates[1]}
								{formatDate(dates[1])}
							{:else}
								<span class="text-primary">Present</span>
							{/if}
						</time>
						<ul class="ms-4 list-outside list-disc">
							{#each descriptions as description, i (i)}
								<li>{description}</li>
							{/each}
						</ul>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<section id="soft-skill" class="mb-14">
		<h2 class="font-incognito mb-3 text-3xl font-bold tracking-tight">
			Soft Skills
		</h2>
		<p class="mb-2">
			Certain soft skills I've picked along the way that deserves mentioning:
		</p>
		<ul class="ms-4 list-outside list-disc">
			{#each softSkills as { title, subtitle }, i (i)}
				<li>
					<span class="text-primary font-bold">{title}</span>
					<ul class="ms-4 list-outside list-disc">
						<li>{subtitle}</li>
					</ul>
				</li>
			{/each}
		</ul>
	</section>

	<section id="hard-skill" class="mb-14">
		<h2 class="font-incognito mb-3 text-3xl font-bold tracking-tight">
			Hard Skills
		</h2>
		<p class="text-accent mb-6 text-base leading-relaxed">
			I am always learning new technologies. Here's an interactive visualization
			of my tech stack and how the technologies connect. Drag nodes around,
			hover to see connections, or click to learn more.
		</p>

		<TechStackVisualization />

		<!-- Fallback grid for accessibility/noscript -->
		<noscript>
			<div class="mt-6 flex flex-col gap-4 lg:grid lg:grid-cols-2">
				{#each hardSkills as { key, items }, i (i)}
					<div class="flex flex-col gap-2">
						<h3 class="font-incognito text-2xl font-semibold tracking-tight">
							{key}
						</h3>
						<ul class="flex flex-row flex-wrap gap-4 lg:max-w-96">
							{#each items as { href, icon, title }, i (i)}
								{@const Icon = icon}
								<li
									class="border-elevation-one hover:border-primary hover:text-primary h-16 w-16 rounded-md border duration-300">
									<a
										{href}
										class="link relative flex h-full w-full flex-col items-center justify-center">
										<span class="label">{title}</span>
										<Icon height={24} width={24} class="flex" />
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</noscript>
	</section>
</main>
