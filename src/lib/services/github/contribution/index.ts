// Import necessary types and utilities
import { parseHTML } from 'linkedom';

import type { Contribution, Level, Result } from '$types/contributions';
import { getDayOfYear, getGitHubYears } from '$utils/date';

/**
 * Fetches GitHub contributions for the specified user across multiple years.
 *
 * @returns A promise that resolves with an object mapping each year to its contribution data.
 */
export async function getGithubContributions(): Promise<{ [year: number]: Result }> {
	const result: { [key: string]: Result } = {};
	const years = getGitHubYears(2024);

	for (const year of years) {
		try {
			if (cache[year] && isValidCache(cache[year])) {
				result[year] = cache[year]!.data;
				continue;
			}

			const dom = await scrapeGithubContribution('antoniosarro', year);
			const res = parse(dom);
			result[year] = res;
			cache[year] = { data: res, timestamp: Date.now() }; // Cache the result with a timestamp
		} catch (error) {
			console.error(`Failed to fetch contributions for year ${year}:`, error);
			throw error;
		}
	}

	return result;
}

/**
 * Scrapes the GitHub contribution data for a given user and year.
 *
 * @param username - The GitHub username whose contributions are to be fetched.
 * @param year - The year for which the contributions should be retrieved.
 * @returns A promise that resolves with the HTML content of the page containing the contributions.
 */
async function scrapeGithubContribution(username: string, year: number): Promise<string> {
	const url = `https://github.com/users/${username}/contributions?from=${year}-01-01&to=${year}-12-31`;

	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Failed to fetch GitHub contributions: ${response.statusText}`);
		}

		return response.text();
	} catch {
		throw new Error('Failed to scrape GitHub contributions');
	}
}

/**
 * Parses HTML content to extract GitHub contribution data.
 *
 * @param dom - The HTML content as a string.
 * @returns An object containing the total contributions and an array of individual contributions.
 */
function parse(dom: string): Result {
	const result: Result = {
		total: 0,
		days: []
	};

	const { document } = parseHTML(dom);
	const dayNodes = document.querySelectorAll('.js-calendar-graph-table .ContributionCalendar-day');

	// Extract the total year contributions
	const totalNode = document.querySelector('.js-yearly-contributions h2');
	if (totalNode) {
		const totalMatch = totalNode.innerHTML.trim().match(/^([0-9,]+)\s/);
		if (!totalMatch) {
			throw new Error('Failed to parse total contributions count.');
		}
		result.total = parseInt(totalMatch[0].replace(/,/g, ''));
	}

	// Extract tooltip information for each contribution day
	const tooltipNodes = Array.from(document.querySelectorAll('.js-calendar-graph tool-tip')).reduce(
		(map: { [key: string]: Element }, elem) => {
			const id = elem.getAttribute('for') || '';
			map[id] = elem;
			return map;
		},
		{}
	);

	dayNodes.forEach((dayNode) => {
		try {
			result.days[getDayOfYear(dayNode.getAttribute('data-date')!) - 1] = parseDay(
				dayNode,
				tooltipNodes
			);
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
 * Parses a single contribution day.
 *
 * @param day - The DOM element representing the day's contribution.
 * @param tooltip - A map of tooltip elements keyed by their 'for' attribute.
 * @returns An object containing details about the contribution.
 */
function parseDay(day: Element, tooltip: Record<string, Element>): Contribution {
	const attributes = {
		id: day.getAttribute('id'),
		date: day.getAttribute('data-date'),
		level: day.getAttribute('data-level')
	};

	if (!attributes.id) throw new Error('Failed to parse contribution id attribute.');
	if (!attributes.date) throw new Error('Failed to parse contribution date attribute.');
	if (!attributes.level) throw new Error('Failed to parse contribution level attribute.');

	let count = 0;
	const tooltipNode = tooltip[attributes.id];
	if (tooltipNode) {
		const text = tooltipNode.firstChild?.nodeValue || '';
		const countMatch = text.trim().match(/^\d+/);
		if (countMatch) {
			count = parseInt(countMatch[0]);
		}
	}

	if (isNaN(count)) throw new Error('Failed to parse contribution count.');

	return { date: attributes.date, count, level: parseInt(attributes.level)! as Level };
}

interface CachedData {
	data: Result;
	timestamp: number; // Unix timestamp in milliseconds
}

const cache: { [year: number]: CachedData | null } = {};

/**
 * Checks if the cached data is still valid.
 *
 * @param cachedData - The cached data to check.
 * @returns `true` if the cached data is still valid, otherwise `false`.
 */
function isValidCache(cachedData: CachedData): boolean {
	const currentTime = Date.now();
	return currentTime - cachedData.timestamp < 3600 * 1000; // 1 hour in milliseconds
}
