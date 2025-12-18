<script lang="ts">
	import { getProjectState } from '$lib/stores/project.svelte';
	import type { RepositoryInfo } from '$lib/types/github/types';
	import { range } from '$lib/utils/generic';
	import ProjectCard from './ProjectCard.svelte';
	import ProjectSkeleton from './ProjectSkeleton.svelte';

	const SKELETON_COUNT = 3;

	let {
		data = [],
		loading,
		recent
	}: { data?: RepositoryInfo[]; loading: boolean; recent?: boolean } = $props();
	let state = getProjectState();

	let filtered = $derived.by(() => {
		if (recent) {
			return data
				.filter((project) => {
					return project.contributor === false;
				})
				.slice(0, 3);
		} else {
			return data.filter((project) => {
				return (
					project.contributor === state.contribution || !project.contributor === state.personal
				);
			});
		}
	});
</script>

<section id="projects">
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
		{#if loading}
			{#each range(SKELETON_COUNT) as _, index (index)}
				<ProjectSkeleton />
			{/each}
		{:else}
			{#each filtered as project (project.name)}
				<ProjectCard {project} />
			{/each}
		{/if}
	</div>
</section>
