import { prerender } from '$app/server';

import { getDayOfYear, getGitHubYears } from '$lib/utils/date';

import type {
	Contribution,
	Level,
	Result
} from '$lib/types/github/contributions';

import { parseHTML } from 'linkedom';

/**
 * Remote function to fetch GitHub contributions across multiple years.
 */
export const getGithubContributions = prerender(
	async (): Promise<{ [year: number]: Result }> => {
		const username = 'antoniosarro';
		const years = getGitHubYears(2024);

		// Fetch all years in parallel
		const results = await Promise.allSettled(
			years.map(async (year) => ({
				year,
				data: await fetchYearContributions(username, year)
			}))
		);

		// Process results
		const contributions: { [year: number]: Result } = {};

		results.forEach((result) => {
			if (result.status === 'fulfilled') {
				contributions[result.value.year] = result.value.data;
			} else {
				console.error(`Failed to fetch contributions:`, result.reason);
			}
		});

		return contributions;
	}
);

/**
 * Scrapes the GitHub contribution data for a given user and year.
 */
async function scrapeGithubContribution(
	username: string,
	year: number
): Promise<string> {
	const url = `https://github.com/users/${username}/contributions?from=${year}-01-01&to=${year}-12-31`;

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(
			`Failed to fetch GitHub contributions: ${response.statusText}`
		);
	}

	return response.text();
}

/**
 * Parses a single contribution day.
 */
function parseDay(
	day: Element,
	tooltip: Record<string, Element>
): Contribution {
	const id = day.getAttribute('id');
	const date = day.getAttribute('data-date');
	const level = day.getAttribute('data-level');

	if (!id || !date || !level) {
		throw new Error('Failed to parse contribution attributes.');
	}

	let count = 0;
	const tooltipNode = tooltip[id];
	if (tooltipNode) {
		const text = tooltipNode.firstChild?.nodeValue || '';
		const countMatch = text.trim().match(/^\d+/);
		if (countMatch) {
			count = parseInt(countMatch[0]);
		}
	}

	if (isNaN(count)) {
		throw new Error('Failed to parse contribution count.');
	}

	return {
		date,
		count,
		level: parseInt(level) as Level
	};
}

/**
 * Parses HTML content to extract GitHub contribution data.
 */
function parse(dom: string): Result {
	const result: Result = {
		total: 0,
		days: []
	};

	const { document } = parseHTML(dom);
	const dayNodes = document.querySelectorAll(
		'.js-calendar-graph-table .ContributionCalendar-day'
	);

	// Extract the total year contributions
	const totalNode = document.querySelector('.js-yearly-contributions h2');
	if (totalNode) {
		const totalMatch = totalNode.innerHTML.trim().match(/^([0-9,]+)\s/);
		if (totalMatch) {
			result.total = parseInt(totalMatch[0].replace(/,/g, ''));
		}
	}

	// Extract tooltip information for each contribution day
	const tooltipNodes = Array.from(
		document.querySelectorAll('.js-calendar-graph tool-tip')
	).reduce((map: Record<string, Element>, elem) => {
		const id = elem.getAttribute('for');
		if (id) {
			map[id] = elem;
		}
		return map;
	}, {});

	dayNodes.forEach((dayNode) => {
		try {
			const date = dayNode.getAttribute('data-date');
			if (date) {
				result.days[getDayOfYear(date) - 1] = parseDay(dayNode, tooltipNodes);
			}
		} catch (error) {
			console.error(
				`Failed to parse contribution for day ${dayNode.getAttribute('data-date')}:`,
				error
			);
		}
	});

	return result;
}

/**
 * Fetches GitHub contributions for a specific year.
 */
async function fetchYearContributions(
	username: string,
	year: number
): Promise<Result> {
	const dom = await scrapeGithubContribution(username, year);
	return parse(dom);
}
