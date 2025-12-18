<script lang="ts">
	import { Metadata } from '$lib/components/shared';
	import { ChangelogTimeline } from '$lib/components/changelog';
	import { getChangelogEntries } from '$lib/services/changelog';
	import { versionInfo } from '$lib/stores/version.svelte';

	const entries = getChangelogEntries();
</script>

<Metadata />

<section class="mx-auto max-w-7xl px-6 md:px-16">
	<header class="mb-10">
		<h1 class="mb-5 font-incognito text-3xl font-semibold tracking-tight sm:text-5xl">Changelog</h1>
		<p class="mb-4 text-base leading-relaxed text-accent">
			A detailed history of all changes, improvements, and updates made to this website. Each
			release is documented with its version number and commit reference.
		</p>
		<div class="flex flex-wrap items-center justify-center gap-2 text-xs sm:gap-4 sm:text-sm">
			<span
				class="rounded-full bg-primary/10 px-3 py-1 font-mono font-semibold text-primary sm:px-4 sm:py-1.5"
			>
				Current: <span class="font-bold">{versionInfo.displayVersion}</span>
			</span>
			{#if versionInfo.commitHash !== 'development'}
				<a
					href={versionInfo.githubCommitUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="rounded-full border border-elevation-one px-3 py-1 font-mono text-accent transition-colors hover:border-primary hover:text-primary sm:px-4 sm:py-1.5"
				>
					{versionInfo.commitHashShort}
				</a>
			{/if}
		</div>
	</header>

	<ChangelogTimeline {entries} />

	<footer class="mt-10 border-t border-elevation-one pt-6 text-center sm:mt-16 sm:pt-8">
		<p class="text-xs text-accent sm:text-sm">
			Want to see the full commit history? Check out the
			<a
				href="https://github.com/antoniosarro/antoniosarro.dev/commits/main"
				target="_blank"
				rel="noopener noreferrer"
				class="text-primary hover:underline"
			>
				GitHub repository
			</a>.
		</p>
	</footer>
</section>
