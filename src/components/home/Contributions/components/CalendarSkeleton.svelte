<script lang="ts">
	import { DEFAULT_LABELS } from '$lib/constants/calendar';
	import { getDimensions, getMonthLabels, groupByWeeks } from '$utils/calendar';
	import { generateMockYearlyDates } from '$utils/date';

	let days = generateMockYearlyDates(2025);
	const weeks = $derived(groupByWeeks(days, 0));
	const { width, height } = $derived(getDimensions(weeks, 12, 4, 22));
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
								class="animate-pulse fill-elevation-one"
								x={0}
								y={22 + (12 + 4) * dayIndex}
								width={12}
								height={12}
								rx={2}
								ry={2}
								data-date={day.date}
								data-level={day.level}
							>
							</rect>
						</g>
					{/if}
				{/each}
			{/each}
		</svg>
	</div>
	<footer class="flex animate-pulse flex-wrap gap-x-1 gap-y-4 whitespace-nowrap">
		<div class="h-5 w-36 rounded-md bg-elevation-one"></div>
		<div class="ml-auto h-5 w-36 rounded-md bg-elevation-one"></div>
	</footer>
</article>
