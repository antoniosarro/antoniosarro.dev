<script lang="ts">
	import ProjectList from '$lib/components/projects/ProjectList.svelte';
	import { Metadata } from '$lib/components/shared';
	import { getGithubProjects } from '$lib/services/github/repositories/index.remote';
	import { setProjectState } from '$lib/stores/project.svelte';

	const projects = getGithubProjects();

	const state = setProjectState();

	const filters = [
		{ key: 'personal' as const, label: 'Personal' },
		{ key: 'contribution' as const, label: 'Contribution' }
	] as const;

	function toggleFilter(key: 'personal' | 'contribution') {
		state[key] = !state[key];
	}
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

		<div class="mb-4 flex flex-row flex-wrap gap-4">
			{#each filters as { key, label } (key)}
				<button
					onclick={() => toggleFilter(key)}
					class="rounded border border-elevation-one px-2 py-1 text-sm font-semibold duration-300 hover:scale-105 hover:border-primary"
					class:bg-primary={state[key]}
					class:text-background={state[key]}
					aria-pressed={state[key]}
				>
					{label}
				</button>
			{/each}
		</div>

		{#await projects}
			<ProjectList loading />
		{:then data}
			<ProjectList {data} loading={false} recent={false} />
		{/await}
	</section>
</main>
