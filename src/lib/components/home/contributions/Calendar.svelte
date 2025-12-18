<script lang="ts">
	import { DEFAULT_LABELS } from '$lib/constants/calendar';
	import { darkMode } from '$lib/stores/theme.svelte';
	import type { Result } from '$lib/types/github/contributions';
	import { getDimensions, getMonthLabels, groupByWeeks } from '$lib/utils/calendar';
	import { range } from '$lib/utils/generic';

	const { data, year }: { data: Result; year: number } = $props();

	const BLOCK_SIZE = 12;
	const BLOCK_MARGIN = 4;
	const LABEL_HEIGHT = 22;
	const WEEK_START = 0;
	const LEVEL_COUNT = 5;

	const THEME = {
		light: ['#bbb7b7', '#f0d6b8', '#e6b98b', '#db955c', '#d27a3d'],
		dark: ['#372d2d', '#f2ddd6', '#e8c4b9', '#dba695', '#c8826b']
	} as const;

	const weeks = $derived(groupByWeeks(data.days, WEEK_START));
	const dimensions = $derived(getDimensions(weeks, BLOCK_SIZE, BLOCK_MARGIN, LABEL_HEIGHT));
	const monthLabels = $derived(getMonthLabels(weeks, DEFAULT_LABELS.months));
	const colors = $derived(darkMode.value ? THEME.dark : THEME.light);

	function getBlockTransform(weekIndex: number): string {
		return `translate(${(BLOCK_SIZE + BLOCK_MARGIN) * weekIndex}, 0)`;
	}

	function getBlockY(dayIndex: number): number {
		return LABEL_HEIGHT + (BLOCK_SIZE + BLOCK_MARGIN) * dayIndex;
	}

	function getActivityLabel(count: number): string {
		return `${count} ${count === 1 ? 'activity' : 'activities'}`;
	}
</script>

<article class="flex w-full flex-col gap-2 text-sm">
	<div class="w-full overflow-x-auto overflow-y-hidden pt-1">
		<svg
			width={dimensions.width}
			height={dimensions.height}
			viewBox="0 0 {dimensions.width} {dimensions.height}"
		>
			<g>
				{#each monthLabels as { label, weekIndex } (weekIndex)}
					<text
						x={(BLOCK_SIZE + BLOCK_MARGIN) * weekIndex}
						y={0}
						dominant-baseline="hanging"
						fill="currentColor"
					>
						{label}
					</text>
				{/each}
			</g>

			{#each weeks as week, weekIndex (weekIndex)}
				<g transform={getBlockTransform(weekIndex)}>
					{#each week as day, dayIndex (dayIndex)}
						{#if day}
							<rect
								x={0}
								y={getBlockY(dayIndex)}
								width={BLOCK_SIZE}
								height={BLOCK_SIZE}
								rx={2}
								ry={2}
								fill={colors[day.level]}
								data-date={day.date}
								data-level={day.level}
							>
								<title>{getActivityLabel(day.count)} on {day.date}</title>
							</rect>
						{/if}
					{/each}
				</g>
			{/each}
		</svg>
	</div>

	<footer class="flex flex-wrap gap-x-1 gap-y-4 whitespace-nowrap">
		<div>{data.total} activities in {year}</div>

		<div class="ml-auto flex items-center gap-1">
			<span>Less</span>
			{#each range(LEVEL_COUNT) as level (level)}
				<svg width={BLOCK_SIZE} height={BLOCK_SIZE}>
					<rect
						fill={colors[level]}
						width={BLOCK_SIZE}
						height={BLOCK_SIZE}
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
