// Import necessary utilities and types
import { DEFAULT_MONTH_LABELS } from '$lib/constants/calendar';
import type { DayIndex, MonthLabel, Week } from '$types/calendar';
import type { Contribution } from '$types/contributions';
import {
	differenceInCalendarDays,
	getDayOfWeek,
	getMonth,
	nextDay,
	parseISO,
	subtractWeeks
} from '$utils/date';
import { range } from '$utils/generic';

/**
 * Calculates the dimensions for the calendar based on the number of weeks, block size, and margin.
 * @param weeks - Array of weeks to display in the calendar.
 * @param blockSize - The height/width of each day block in pixels.
 * @param blockMargin - The spacing between blocks in pixels.
 * @param labelHeight - The height reserved for month labels in pixels.
 * @returns An object containing the width and height of the calendar.
 */
export function getDimensions(
	weeks: Array<Week>,
	blockSize: number,
	blockMargin: number,
	labelHeight: number
) {
	return {
		width: weeks.length * (blockSize + blockMargin) - blockMargin,
		height: labelHeight + (blockSize + blockMargin) * 7 - blockMargin
	};
}

/**
 * Groups contributions into weeks based on a specified week start day.
 * @param contributions - Array of GitHub contributions to group by week.
 * @param weekStart - The index of the first day of the week (0 for Sunday, 1 for Monday, etc.).
 * @returns An array of weeks, each containing up to 7 days of contributions.
 */
export function groupByWeeks(
	contributions: Array<Contribution>,
	weekStart: DayIndex = 0
): Array<Week> {
	const firstContribution = contributions[0];
	const firstDate = parseISO(firstContribution.date);
	const firstCalendarDate =
		getDayOfWeek(firstDate).number === weekStart
			? firstDate
			: subtractWeeks(nextDay(firstDate, weekStart), 1);

	// Pad the beginning of the array with undefined contributions to align the start day
	const paddedActivities = [
		...(Array(differenceInCalendarDays(firstDate, firstCalendarDate)).fill(
			undefined
		) as Array<Contribution>),
		...contributions
	];

	// Calculate the number of weeks needed to fit all activities
	const numberOfWeeks = Math.ceil(paddedActivities.length / 7);

	// Group contributions into weeks
	return range(numberOfWeeks).map((weekIndex) =>
		paddedActivities.slice(weekIndex * 7, weekIndex * 7 + 7)
	);
}

/**
 * Generates month labels for each month in the calendar.
 * @param weeks - Array of weeks to determine month labels for.
 * @param monthNames - Optional array of month names (defaults to DEFAULT_MONTH_LABELS).
 * @returns An array of objects containing the week index and corresponding month label.
 */
export function getMonthLabels(
	weeks: Array<Week>,
	monthNames: Array<string> = DEFAULT_MONTH_LABELS
): Array<MonthLabel> {
	return weeks
		.reduce<Array<MonthLabel>>((labels, week, weekIndex) => {
			const firstActivity = week.find((activity) => activity !== undefined);

			if (!firstActivity) {
				throw new Error(`Unexpected error: Week ${weekIndex + 1} is empty.`);
			}

			const month = monthNames[getMonth(parseISO(firstActivity.date))];

			if (!month) {
				const monthName = new Date(firstActivity.date).toLocaleString('en-US', { month: 'short' });
				throw new Error(`Unexpected error: undefined month label for ${monthName}.`);
			}

			const prevLabel = labels[labels.length - 1];

			// Only add a new label if it's the first week or if it's a different month
			if (weekIndex === 0 || !prevLabel || prevLabel.label !== month) {
				return [...labels, { weekIndex, label: month }];
			}

			return labels;
		}, [])
		.filter(({ weekIndex }, index, labels) => {
			// Filter out unnecessary month labels to avoid overflow
			const minWeeks = 3;

			if (index === 0) {
				// Skip the first month label if there isn't enough space for the next one
				return labels[1] && labels[1].weekIndex - weekIndex >= minWeeks;
			}

			if (index === labels.length - 1) {
				// Skip the last month label if there isn't enough data in that month
				return weeks.slice(weekIndex).length >= minWeeks;
			}

			return true;
		});
}
