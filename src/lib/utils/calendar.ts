import { DEFAULT_MONTH_LABELS } from '$lib/constants/calendar';
import {
	differenceInCalendarDays,
	getDayOfWeek,
	getMonth,
	nextDay,
	parseISO,
	subtractWeeks
} from '$lib/utils/date';
import { range } from '$lib/utils/generic';

import type { DayIndex, MonthLabel, Week } from '$lib/types/github/calendar';
import type { Contribution } from '$lib/types/github/contributions';

export function getDimensions(
	weeks: Week[],
	blockSize: number,
	blockMargin: number,
	labelHeight: number
) {
	return {
		width: weeks.length * (blockSize + blockMargin) - blockMargin,
		height: labelHeight + (blockSize + blockMargin) * 7 - blockMargin
	};
}

export function groupByWeeks(
	contributions: Contribution[],
	weekStart: DayIndex = 0
): Week[] {
	const firstContribution = contributions[0];
	const firstDate = parseISO(firstContribution.date);
	const firstCalendarDate =
		getDayOfWeek(firstDate).number === weekStart
			? firstDate
			: subtractWeeks(nextDay(firstDate, weekStart), 1);

	const paddingDays = differenceInCalendarDays(firstDate, firstCalendarDate);
	const paddedActivities = [
		...(Array(paddingDays).fill(undefined) as Contribution[]),
		...contributions
	];

	const numberOfWeeks = Math.ceil(paddedActivities.length / 7);

	return range(numberOfWeeks).map((weekIndex) =>
		paddedActivities.slice(weekIndex * 7, weekIndex * 7 + 7)
	);
}

export function getMonthLabels(
	weeks: Week[],
	monthNames: string[] = DEFAULT_MONTH_LABELS
): MonthLabel[] {
	const MIN_WEEKS_FOR_LABEL = 3;

	return weeks
		.reduce<MonthLabel[]>((labels, week, weekIndex) => {
			const firstActivity = week.find((activity) => activity !== undefined);

			if (!firstActivity) {
				throw new Error(`Unexpected error: Week ${weekIndex + 1} is empty.`);
			}

			const month = monthNames[getMonth(parseISO(firstActivity.date))];

			if (!month) {
				const monthName = new Date(firstActivity.date).toLocaleString('en-US', {
					month: 'short'
				});
				throw new Error(
					`Unexpected error: undefined month label for ${monthName}.`
				);
			}

			const prevLabel = labels[labels.length - 1];

			if (weekIndex === 0 || !prevLabel || prevLabel.label !== month) {
				return [...labels, { weekIndex, label: month }];
			}

			return labels;
		}, [])
		.filter(({ weekIndex }, index, labels) => {
			if (index === 0) {
				return (
					labels[1] && labels[1].weekIndex - weekIndex >= MIN_WEEKS_FOR_LABEL
				);
			}

			if (index === labels.length - 1) {
				return weeks.slice(weekIndex).length >= MIN_WEEKS_FOR_LABEL;
			}

			return true;
		});
}
