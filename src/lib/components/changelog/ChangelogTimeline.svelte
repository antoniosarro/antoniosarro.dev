<script lang="ts">
	import ChangelogCard from './ChangelogCard.svelte';
	import ChangelogModal from './ChangelogModal.svelte';

	import type { ChangelogEntry } from '$lib/types/changelog';

	interface Props {
		entries: ChangelogEntry[];
	}

	let { entries }: Props = $props();

	let selectedEntry = $state<ChangelogEntry | null>(null);

	function openModal(entry: ChangelogEntry) {
		selectedEntry = entry;
	}

	function closeModal() {
		selectedEntry = null;
	}
</script>

<div class="relative w-full overflow-x-hidden">
	<div
		class="from-primary via-elevation-one absolute top-0 bottom-0 left-[7px] w-0.5 bg-linear-to-b to-transparent
			   md:left-1/2 md:-translate-x-1/2">
	</div>

	<!-- Entries -->
	<div class="flex flex-col gap-6 md:gap-12">
		{#each entries as entry, index (entry.version)}
			<ChangelogCard {entry} {index} onclick={() => openModal(entry)} />
		{/each}
	</div>
</div>

<!-- Modal -->
<ChangelogModal entry={selectedEntry} onclose={closeModal} />
