<script lang="ts">
	import Github from '~icons/mdi/github';

	import { footerTechStack } from '$lib/data/techs';
	import { versionInfo } from '$lib/stores/version.svelte';
</script>

<footer
	class="border-elevation-one relative mt-10 min-h-full border-t md:mt-28">
	<div
		class="mx-auto flex max-w-7xl flex-col items-center justify-center gap-y-4 px-6 py-16 md:px-16 lg:flex-row lg:justify-between">
		<div class="flex flex-col items-center gap-x-2">
			<h3 class="font-inter">
				Made with <span class="text-primary font-bold">pain</span>
				&
				<span class="text-primary font-bold">love</span>
				using:
			</h3>
			<ul class="mt-3 flex items-center gap-x-8 text-sm">
				{#each footerTechStack as { href, icon, label, name } (label)}
					{@const Icon = icon}
					<li>
						<a
							class="text-primary flex items-center gap-x-1 hover:underline"
							{href}
							rel="noreferrer noopener"
							target="_blank"
							aria-label={label}>
							<Icon class="flex" width={18} height={18} />
							{name}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<div
			class="flex flex-col items-center gap-2 text-center lg:items-end lg:text-end">
			<div class="flex items-center gap-2 text-sm">
				<a
					href="/changelog"
					class="text-primary font-mono duration-200 hover:underline"
					title="View changelog">
					{versionInfo.displayVersion}
				</a>
				<span class="text-accent">•</span>
				{#if versionInfo.commitHash !== 'development'}
					<a
						href={versionInfo.githubCommitUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="text-accent hover:text-primary flex items-center gap-1 font-mono duration-200"
						title="View commit on GitHub">
						<Github class="size-3.5" />
						{versionInfo.commitHashShort}
					</a>
				{:else}
					<span class="text-accent font-mono" title="Development build">
						{versionInfo.commitHashShort}
					</span>
				{/if}
			</div>
			<small class="opacity-60">
				Copyright &copy; Antonio Sarro {new Date().getFullYear()} All rights Reserved
			</small>
		</div>
	</div>
</footer>
