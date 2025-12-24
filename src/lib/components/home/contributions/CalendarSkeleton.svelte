<script lang="ts">
	import { DEFAULT_LABELS } from '$lib/constants/calendar';
	import {
		getDimensions,
		getMonthLabels,
		groupByWeeks
	} from '$lib/utils/calendar';
	import { generateMockYearlyDates } from '$lib/utils/date';

	const BLOCK_SIZE = 12;
	const BLOCK_MARGIN = 4;
	const LABEL_HEIGHT = 22;
	const WEEK_START = 0;

	const days = generateMockYearlyDates(2025);
	const weeks = $derived(groupByWeeks(days, WEEK_START));
	const dimensions = $derived(
		getDimensions(weeks, BLOCK_SIZE, BLOCK_MARGIN, LABEL_HEIGHT)
	);
	const monthLabels = $derived(getMonthLabels(weeks, DEFAULT_LABELS.months));

	function getBlockTransform(weekIndex: number): string {
		return `translate(${(BLOCK_SIZE + BLOCK_MARGIN) * weekIndex}, 0)`;
	}

	function getBlockY(dayIndex: number): number {
		return LABEL_HEIGHT + (BLOCK_SIZE + BLOCK_MARGIN) * dayIndex;
	}
</script>

<article class="flex w-full flex-col gap-2 text-sm">
	<div class="w-full overflow-x-auto overflow-y-hidden pt-1">
		<svg
			width={dimensions.width}
			height={dimensions.height}
			viewBox="0 0 {dimensions.width} {dimensions.height}">
			<g>
				{#each monthLabels as { label, weekIndex } (weekIndex)}
					<text
						x={(BLOCK_SIZE + BLOCK_MARGIN) * weekIndex}
						y={0}
						dominant-baseline="hanging"
						fill="currentColor">
						{label}
					</text>
				{/each}
			</g>

			{#each weeks as week, weekIndex (weekIndex)}
				<g transform={getBlockTransform(weekIndex)}>
					{#each week as day, dayIndex (dayIndex)}
						{#if day}
							<rect
								class="fill-elevation-one animate-pulse"
								x={0}
								y={getBlockY(dayIndex)}
								width={BLOCK_SIZE}
								height={BLOCK_SIZE}
								rx={2}
								ry={2}
								data-date={day.date}
								data-level={day.level} />
						{/if}
					{/each}
				</g>
			{/each}
		</svg>
	</div>

	<footer
		class="flex animate-pulse flex-wrap gap-x-1 gap-y-4 whitespace-nowrap">
		<div class="bg-elevation-one h-5 w-36 rounded-md"></div>
		<div class="bg-elevation-one ml-auto h-5 w-36 rounded-md"></div>
	</footer>
</article>
