<script lang="ts">
	import { ChangelogTimeline } from '$lib/components/changelog';
	import { Metadata } from '$lib/components/shared';
	import { getChangelogEntries } from '$lib/services/changelog';
	import { versionInfo } from '$lib/stores/version.svelte';

	const entries = getChangelogEntries();
</script>

<Metadata />

<section class="mx-auto max-w-7xl px-6 md:px-16">
	<header class="mb-10">
		<h1
			class="font-incognito mb-5 text-3xl font-semibold tracking-tight sm:text-5xl">
			Changelog
		</h1>
		<p class="text-accent mb-4 text-base leading-relaxed">
			A detailed history of all changes, improvements, and updates made to this
			website. Each release is documented with its version number and commit
			reference.
		</p>
		<div
			class="flex flex-wrap items-center justify-center gap-2 text-xs sm:gap-4 sm:text-sm">
			<span
				class="bg-primary/10 text-primary rounded-full px-3 py-1 font-mono font-semibold sm:px-4 sm:py-1.5">
				Current: <span class="font-bold">{versionInfo.displayVersion}</span>
			</span>
			{#if versionInfo.commitHash !== 'development'}
				<a
					href={versionInfo.githubCommitUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="border-elevation-one text-accent hover:border-primary hover:text-primary rounded-full border px-3 py-1 font-mono transition-colors sm:px-4 sm:py-1.5">
					{versionInfo.commitHashShort}
				</a>
			{/if}
		</div>
	</header>

	<ChangelogTimeline {entries} />

	<footer
		class="border-elevation-one mt-10 border-t pt-6 text-center sm:mt-16 sm:pt-8">
		<p class="text-accent text-xs sm:text-sm">
			Want to see the full commit history? Check out the
			<a
				href="https://github.com/antoniosarro/antoniosarro.dev/commits/main"
				target="_blank"
				rel="noopener noreferrer"
				class="text-primary hover:underline">
				GitHub repository
			</a>
			.
		</p>
	</footer>
</section>
