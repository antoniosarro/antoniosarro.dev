<script lang="ts">
	import 'iconify-icon';

	import type { RepositoryInfo } from '$types/github/types';
	import { formatDateFull } from '$utils/date';

	const { project }: { project: RepositoryInfo } = $props();

	const languagesColors: {
		[key: string]: string;
	} = {
		Svelte: 'bg-orange-500',
		TypeScript: 'bg-blue-500',
		JavaScript: 'bg-yellow-500',
		Nix: 'bg-indigo-500',
		Shell: 'bg-gray-500'
	};
</script>

<a
	data-umami-event="opened {project.name} project"
	class="group flex h-fit min-h-44 break-inside-avoid flex-col items-start gap-2 rounded-lg border border-elevation-one p-4 duration-300 last:hidden hover:-translate-y-1 hover:border-primary xl:last:block"
	href={project.href}
>
	<div class="flex w-full flex-row items-center justify-between">
		<div class="flex flex-row items-center gap-2">
			<img class="h-5 w-5 rounded-full sm:h-6 sm:w-6" src={project.ownerPic} alt="owner pic" />
			<h5 class="sm:text-lg">{project.owner}</h5>
		</div>
		<div class="flex flex-row items-center gap-1 opacity-80">
			<h6 class="text-sm sm:text-base">{formatDateFull(project.lastUpdate)}</h6>
			<iconify-icon noobserver height="20" width="20" icon="material-symbols:update"></iconify-icon>
		</div>
	</div>
	<div class="flex flex-col">
		<div class="flex flex-row items-center gap-3">
			<h3 class="text-lg font-bold sm:text-xl">{project.name}</h3>
			{#if project.contributor}
				<div class="rounded-md border border-elevation-one px-1 py-[0.5px]">
					<h5 class="text-xs font-semibold text-accent sm:text-sm">Contributor</h5>
				</div>
			{/if}
		</div>
		<h6 class="min-h-12 text-sm opacity-80 sm:text-base lg:line-clamp-2">{project.description}</h6>
	</div>
	<div class="flex w-full flex-row gap-4">
		<div class="flex flex-row items-center gap-2">
			<span
				class="inline-block h-3 w-3 rounded-full sm:h-4 sm:w-4 {languagesColors[project.language]}"
			></span>
			<h6 class="text-sm opacity-80 sm:text-base">{project.language}</h6>
		</div>
		<div class="flex flex-row items-center gap-1 opacity-80">
			<iconify-icon noobserver height="20" width="20" icon="material-symbols:star"></iconify-icon>
			<h6 class="text-sm sm:text-base">{project.stars}</h6>
		</div>
		<div class="flex flex-row items-center gap-1 opacity-80">
			<iconify-icon noobserver height="20" width="20" icon="gg:git-fork"></iconify-icon>
			<h6 class="text-sm sm:text-base">{project.forks}</h6>
		</div>
	</div>
</a>
