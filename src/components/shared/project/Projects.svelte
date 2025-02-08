<script lang="ts">
	import { getProjectState } from '$lib/stores/project.svelte';
	import type { RepositoryInfo } from '$types/github/types';

	import Project from './Project.svelte';
	import SkeletonProject from './SkeletonProject.svelte';

	let {
		projects = [],
		loading,
		recent
	}: { projects?: RepositoryInfo[]; loading: boolean; recent?: boolean } = $props();
	let state = getProjectState();

	let filtered = $derived.by(() => {
		if (recent) {
			return projects
				.filter((project) => {
					return project.contributor === false;
				})
				.slice(0, 2);
		} else {
			return projects.filter((project) => {
				return (
					project.contributor === state.contribution || !project.contributor === state.personal
				);
			});
		}
	});
</script>

<section id="projects">
	<div class="flex flex-col gap-4">
		{#if !loading}
			{#each filtered as project}
				{#if project}
					<Project {project} />
				{/if}
			{/each}
		{:else}
			<SkeletonProject />
			<SkeletonProject />
		{/if}
	</div>
</section>
