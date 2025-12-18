<script lang="ts">
	import type { Result } from '$lib/types/github/contributions';
	import { getGitHubYears } from '$lib/utils/date';
	import Calendar from './Calendar.svelte';

	let years = getGitHubYears(2024);
	let selectedYear = $state(years[0]);

	const {
		data
	}: {
		data: {
			[key: string]: Result;
		};
	} = $props();
</script>

<div class="flex flex-col gap-4 xl:flex-row">
	<div class="max-h-fit max-w-fit rounded-lg border border-elevation-one p-4 md:p-6 lg:p-8">
		<Calendar data={data[selectedYear]} year={selectedYear} />
	</div>
	<div class="flex flex-row flex-wrap justify-start gap-2 xl:flex-col">
		{#each years as year (year)}
			<button
				class="rounded-lg border px-4 py-2 text-center text-sm font-medium duration-300 {year ===
				selectedYear
					? 'text border-transparent bg-primary text-background'
					: 'border-elevation-one hover:border-primary'}"
				onclick={() => (selectedYear = year)}
				title={`View Graph for the year ${year}`}
			>
				{year}
			</button>
		{/each}
	</div>
</div>
