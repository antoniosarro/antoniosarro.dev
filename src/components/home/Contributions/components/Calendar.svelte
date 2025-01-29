<script lang="ts">
	import { DEFAULT_LABELS } from '$lib/constants/calendar';
	import { darkMode } from '$lib/stores/dark.svelte';
	import type { Result } from '$types/github';
	import { getDimensions, getMonthLabels, groupByWeeks } from '$utils/calendar';
	import { range } from '$utils/generic';

	const { data, year }: { data: Result; year: number } = $props();

	// Utility variables
	const weeks = $derived(groupByWeeks(data.days, 0));
	const { width, height } = $derived(getDimensions(weeks, 12, 4, 22));

	// Colors
	const theme = {
		light: ['#bbb7b7', '#f0d6b8', '#e6b98b', '#db955c', '#d27a3d'],
		dark: ['#372d2d', '#f2ddd6', '#e8c4b9', '#dba695', '#c8826b']
	};
</script>

<article class="flex w-full flex-col gap-2 text-sm">
	<div class="w-full overflow-x-auto overflow-y-hidden pt-1">
		<svg {width} {height} viewBox={`0 0 ${width} ${height}`}>
			<g>
				{#each getMonthLabels(weeks, DEFAULT_LABELS.months) as { label, weekIndex }}
					<text x={(12 + 4) * weekIndex} y={0} dominant-baseline="hanging" fill="currentColor">
						{label}
					</text>
				{/each}
			</g>
			{#each weeks as week, weekIndex}
				{#each week as day, dayIndex}
					{#if day}
						<g transform={`translate(${(12 + 4) * weekIndex}, 0)`}>
							<rect
								x={0}
								y={22 + (12 + 4) * dayIndex}
								width={12}
								height={12}
								rx={2}
								ry={2}
								fill={$darkMode ? theme['dark'][day.level] : theme['light'][day.level]}
								data-date={day.date}
								data-level={day.level}
							>
								<title
									>{`${day.count} ${day.count < 2 ? 'activity' : 'activities'} on ${day.date}`}</title
								>
							</rect>
						</g>
					{/if}
				{/each}
			{/each}
		</svg>
	</div>
	<footer class="flex flex-wrap gap-x-1 gap-y-4 whitespace-nowrap">
		<div>
			{`${data.total} activities in ${year}`}
		</div>
		<div class="ml-auto flex items-center gap-1">
			<span>Less</span>
			{#each range(5) as level}
				<svg width={12} height={12}>
					<rect
						fill={$darkMode ? theme['dark'][level] : theme['light'][level]}
						width={12}
						height={12}
						rx={2}
						ry={2}
						class="stroke-elevation-one"
					/>
				</svg>
			{/each}
			<span>More</span>
		</div>
	</footer>
</article>
