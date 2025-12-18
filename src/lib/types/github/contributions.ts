export type Level = 0 | 1 | 2 | 3 | 4;

/**
 * Represents a single contribution day.
 */
export interface Contribution {
	/**
	 * The date of the contribution in ISO format, e.g., "2023-10-01".
	 */
	date: string;

	/**
	 * The number of contributions made on that specific day.
	 */
	count: number;

	/**
	 * The level of contribution based on a predefined scale (0 to 4).
	 * - Level 0: No contributions
	 * - Level 1: Minimum contribution
	 * - Level 2: Medium contribution
	 * - Level 3: Significant contribution
	 * - Level 4: Maximum contribution
	 */
	level: Level;
}

/**
 * Represents the result of fetching contributions for a specific year.
 */
export interface Result {
	/**
	 * The total number of contributions made during the year.
	 */
	total: number;

	/**
	 * An array of Contribution objects, each representing a day's contribution data.
	 */
	days: Contribution[];
}
