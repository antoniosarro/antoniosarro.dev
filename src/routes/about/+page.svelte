<script lang="ts">
	import 'iconify-icon';

	import { Metadata } from '$components/shared/misc';
	import Logo from '$components/shared/navbar/Logo.svelte';
	import { experiences } from '$data/experiences';
	import { hardSkills } from '$data/hardSkills';
	import { mail } from '$data/socials';
	import { softSkills } from '$data/softskills';
	import resume from '$lib/assets/cv/Antonio_Sarro_CV.pdf';
	import profile from '$lib/assets/images/profile.webp';
	import { calculateAge, formatDate } from '$utils/date';

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
			<h1 class="font-incognito text-3xl font-semibold tracking-tight sm:text-5xl lg:leading-tight">
				Hi! I'm Antonio Sarro <span class="wave-emoji">👋🏼</span>
			</h1>
			<p>
				I'm a <span class="font-bold text-primary">{calculateAge(new Date('1999-11-16'))}</span>
				years old software engineer based in
				<span class="font-bold text-primary">Italy</span>. I've always had a strong
				<span class="font-bold text-primary">passion</span> and predisposition for hardware and IT since
				I was a child, which has always pushed me to learn and delve deeper into this field.
			</p>

			<p>
				Being a very
				<span class="font-bold text-primary">curious</span>
				person who always wants to discover something new, I like to study and understand new technologies
				for personal of future projects.
			</p>

			<p>
				In my free time, I enjoy listening to <span class="font-bold text-primary">music</span>,
				playing
				<span class="font-bold text-primary">games or chess</span> and going to the
				<span class="font-bold text-primary">gym</span>.
			</p>
		</div>
		<div class="hidden lg:block">
			<img
				height={350}
				width={350}
				class="mb-4 max-h-72 min-h-72 rounded-2xl bg-top object-cover"
				src={profile}
				alt="profile pic"
			/>
			<div class="flex flex-col gap-y-4 text-center">
				<div class="flex items-center gap-x-3">
					<button
						onclick={() => downloadResume(resume)}
						class="flex-center flex basis-[90%] justify-center gap-x-2 rounded-md border border-elevation-one py-2 text-center font-incognito text-lg font-semibold duration-500 hover:bg-primary hover:text-background"
					>
						View Resume <iconify-icon
							noobserver
							height="20"
							width="20"
							class="flex"
							icon="majesticons:open"
						></iconify-icon>
					</button>
					<a
						class="rounded-md border border-elevation-one p-3 duration-500 hover:bg-primary hover:text-background"
						href={mail}
						aria-label={'Mail'}
					>
						<iconify-icon
							noobserver
							height="20"
							width="20"
							class="flex"
							icon="material-symbols:mail"
						></iconify-icon>
					</a>
				</div>
			</div>
		</div>
	</section>

	<section id="work" class="mb-14">
		<h2 class="mb-3 font-incognito text-3xl font-bold tracking-tight">Work Experience</h2>
		<div class="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2">
			{#each experiences as { company, dates, position, descriptions, logo }}
				<div
					class="max-2-2xl relative flex items-start gap-x-4 before:absolute before:bottom-0 before:left-9 before:top-[5rem] before:h-[calc(100%-70px)] before:w-[1px] before:bg-elevation-one"
				>
					<a
						href="/"
						class="relative grid min-h-[80px] min-w-[80px] place-items-center overflow-clip rounded-md border border-elevation-one fill-text p-2"
					>
						{#if logo}
							<img
								src="/experiences/{logo}.webp"
								alt="{company} logo"
								class="object-cover"
								width={50}
								height={50}
							/>
						{:else}
							<Logo />
						{/if}
					</a>
					<div class="flex flex-col items-start">
						<h3 class="text-xl font-semibold">{company}</h3>
						<p class="mb-2">{position}</p>
						<time class="mb-3 text-sm uppercase tracking-widest opacity-70">
							{formatDate(dates[0])} - {' '}
							{#if dates[1]}
								{formatDate(dates[1])}
							{:else}
								<span class="text-primary"> Present </span>
							{/if}
						</time>
						<ul class="ms-4 list-outside list-disc">
							{#each descriptions as description}
								<li>{description}</li>
							{/each}
						</ul>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<section id="soft-skill" class="mb-14">
		<h2 class="mb-3 font-incognito text-3xl font-bold tracking-tight">Soft Skills</h2>
		<p class="mb-2">Certain soft skills I've picked along the way that deserves mentioning:</p>
		<ul class="ms-4 list-outside list-disc">
			{#each softSkills as { title, subtitle }}
				<li>
					<span class="font-bold text-primary">{title}</span>
					<ul class="ms-4 list-outside list-disc">
						<li>{subtitle}</li>
					</ul>
				</li>
			{/each}
		</ul>
	</section>

	<section id="hard-skill" class="mb-14">
		<h2 class="mb-3 font-incognito text-3xl font-bold tracking-tight">Hard Skills</h2>
		<p class="mb-4">I am always learning new technologies, but I am currently proficient in:</p>
		<div class="flex flex-col gap-4 lg:grid lg:grid-cols-2">
			{#each hardSkills as { key, items }}
				<div class="flex flex-col gap-2">
					<h3 class="font-incognito text-2xl font-semibold tracking-tight">{key}</h3>
					<ul class="flex flex-row flex-wrap gap-4 lg:max-w-96">
						{#each items as { href, icon, title }}
							<li
								class="h-16 w-16 rounded-md border border-elevation-one duration-300 hover:border-primary hover:text-primary"
							>
								<a
									{href}
									class="link relative flex h-full w-full flex-col items-center justify-center"
								>
									<span class="label">{title}</span>
									<iconify-icon noobserver height="24" width="24" class="flex" {icon}
									></iconify-icon>
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</section>
</main>

<style lang="postcss">
	.wave-emoji {
		animation: wave 2.5s infinite;
		transform-origin: 70% 70%;
		display: inline-block;
	}

	@keyframes wave {
		0% {
			transform: rotate(0deg);
		}
		10% {
			transform: rotate(14deg);
		}
		20% {
			transform: rotate(-8deg);
		}
		30% {
			transform: rotate(14deg);
		}
		40% {
			transform: rotate(-4deg);
		}
		50% {
			transform: rotate(10deg);
		}
		60%,
		100% {
			transform: rotate(0deg);
		}
	}

	.link {
		.label {
			position: absolute;
			top: -15px;
			left: -15px;
			transform: rotate(-10deg) scale(0);
			transition: transform 0.3s ease-in-out;
			@apply w-fit rounded-md border border-primary bg-background px-2 py-0.5 text-sm text-text;
		}

		&:hover .label {
			transform: rotate(-10deg) scale(1);
		}
	}
</style>
