<script lang="ts">
	import { Metadata } from '$components/shared/misc';
	import { Projects } from '$components/shared/project';
	import { setProjectState } from '$lib/stores/project.svelte';
	import type { RepositoryInfo } from '$types/github/types';

	const {
		data
	}: {
		data: {
			projects: Promise<RepositoryInfo[]>;
		};
	} = $props();

	let state = setProjectState();
</script>

<Metadata />

<main class="mx-auto max-w-7xl px-6 md:px-16">
	<section class="mb-10">
		<header class="mb-10">
			<h1 class="mb-5 font-incognito text-3xl font-semibold tracking-tight sm:text-5xl">
				Projects
			</h1>
			<p class="mb-4 text-base leading-relaxed text-accent">
				Here are some projects I'm particularly proud of, along with projects I've contributed to.
				Many are open-source – take a look at the code and contribute if you have any ideas!
			</p>
		</header>
		<div class="mb-4 flex flex-row gap-4">
			<button
				onclick={() => (state.personal = !state.personal)}
				class="{state.personal
					? 'bg-primary text-background'
					: ''} rounded border border-elevation-one px-2 py-1 text-sm font-semibold duration-300 hover:scale-105 hover:border-primary"
			>
				Personal
			</button>
			<button
				onclick={() => (state.contribution = !state.contribution)}
				class="{state.contribution
					? 'bg-primary text-background'
					: ''} rounded border border-elevation-one px-2 py-1 text-sm font-semibold duration-300 hover:scale-105 hover:border-primary"
			>
				Contribution
			</button>
		</div>
		{#await data.projects}
			<Projects loading={true} />
		{:then projects}
			<Projects {projects} loading={false} recent={false} />
		{/await}
	</section>
</main>
