/**
 * Generates an array of numbers from 0 to n-1.
 *
 * @param {number} n - The upper limit (exclusive).
 * @returns {number[]} An array containing the range [0, n-1].
 */
export function range(n: number): number[] {
	return Array.from({ length: n }, (_, i) => i);
}
