import type { Frontmatter } from '$types/blog';

export function isValidBlogFile(
	file: unknown,
	slug: string
): file is { metadata: Omit<Frontmatter, 'slug'> } {
	return !!file && typeof file === 'object' && 'metadata' in file && !!slug;
}

/* const HEADING_REGEX = /<h[2-6](?:[^<]*)<\/h[2-6]>/g; */
const HEADING_REGEX = /<h[1-6][^>]*>.*?<\/h[1-6]>/g;

/**
 * Extracts headings from the given source string.
 * @param source - The source string to extract headings from.
 * @returns An array of objects with text, id, and level properties representing the extracted headings.
 */
export const getHeadings = (source: string) => {
	// Regular expression to match headings
	const matches = source.match(HEADING_REGEX);

	// Check if matches exist and if window object is available
	if (matches && typeof window !== 'undefined') {
		// Extract and map the headings
		return Array.from(matches, (heading) => {
			// Parse the heading using DOMParser
			const { textContent, id, tagName } = new DOMParser().parseFromString(heading, 'text/html')
				.body.firstChild as Element;

			// Return an object with extracted heading properties
			return {
				text: textContent,
				id: id,
				level: parseInt(tagName[1])
			};
		});
	}
	// Return an empty array if no matches or window object is not available
	return [];
};
