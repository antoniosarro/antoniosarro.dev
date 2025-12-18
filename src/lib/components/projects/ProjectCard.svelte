<script lang="ts">
	import Update from '~icons/material-symbols/update';
	import Star from '~icons/material-symbols/star';
	import GitFork from '~icons/gg/git-fork';
	import Book from '~icons/lets-icons/book';
	import Link from '~icons/ci/external-link';

	import type { RepositoryInfo } from '$lib/types/github/types';
	import { formatDateFull } from '$lib/utils/date';

	const { project }: { project: RepositoryInfo } = $props();

	const LANGUAGE_COLORS: Record<string, string> = {
		Svelte: 'bg-orange-500',
		TypeScript: 'bg-blue-500',
		JavaScript: 'bg-yellow-500',
		Nix: 'bg-indigo-500',
		Shell: 'bg-gray-500',
		Rust: 'bg-[#63452c]'
	};

	const projectUrl = project.hasArticle ? `/projects/${project.name.toLowerCase()}` : project.href;
	const isExternal = !project.hasArticle;
</script>

<a
	data-umami-event="opened {project.name} project"
	class="group flex h-fit min-h-44 break-inside-avoid flex-col gap-2 rounded-lg border border-elevation-one p-4 duration-300 last:hidden hover:-translate-y-1 hover:border-primary xl:last:block"
	href={projectUrl}
	target={isExternal ? '_blank' : '_self'}
	rel={isExternal ? 'noopener noreferrer' : undefined}
>
	<!-- Header -->
	<div class="flex w-full items-center justify-between">
		<div class="flex items-center gap-2">
			<img
				class="size-5 rounded-full sm:size-6"
				src={project.ownerPic}
				alt="{project.owner}'s avatar"
			/>
			<h5 class="sm:text-lg">{project.owner}</h5>
		</div>
		<div class="flex items-center gap-1 opacity-80">
			<h6 class="text-sm sm:text-base">{formatDateFull(project.lastUpdate)}</h6>
			<Update height={20} width={20} />
		</div>
	</div>

	<!-- Title and Description -->
	<div class="flex flex-col">
		<div class="flex items-center gap-3">
			<h3 class="text-lg font-bold sm:text-xl">{project.name}</h3>
			{#if project.contributor}
				<div class="rounded-md border border-elevation-one px-1 py-[0.5px]">
					<h5 class="text-xs font-semibold text-accent sm:text-sm">Contributor</h5>
				</div>
			{/if}
			{#if project.hasArticle}
				<div class="rounded-md border border-primary bg-primary/10 px-1 py-[0.5px]">
					<h5 class="text-xs font-semibold text-primary sm:text-sm">Article</h5>
				</div>
			{/if}
		</div>
		<h6 class="min-h-12 text-sm opacity-80 sm:text-base lg:line-clamp-2">{project.description}</h6>
	</div>

	<!-- Footer Stats -->
	<div class="flex w-full gap-4">
		<div class="flex items-center gap-2">
			<span class="inline-block size-3 rounded-full sm:size-4 {LANGUAGE_COLORS[project.language]}"
			></span>
			<h6 class="text-sm opacity-80 sm:text-base">{project.language}</h6>
		</div>

		<div class="flex items-center gap-1 opacity-80">
			<Star height={20} width={20} />
			<h6 class="text-sm sm:text-base">{project.stars}</h6>
		</div>

		<div class="flex items-center gap-1 opacity-80">
			<GitFork height={20} width={20} />
			<h6 class="text-sm sm:text-base">{project.forks}</h6>
		</div>

		{#if project.hasArticle}
			<div class="ml-auto flex items-center gap-1 text-primary">
				<Book height={20} width={20} />
				<h6 class="text-sm sm:text-base">Read Article</h6>
			</div>
		{:else}
			<div class="ml-auto flex items-center gap-1 opacity-80">
				<Link height={20} width={20} />
			</div>
		{/if}
	</div>
</a>
