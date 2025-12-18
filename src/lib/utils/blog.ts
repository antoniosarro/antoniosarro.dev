import { seriesConfig } from '$lib/data/series';
import type { Blog, Frontmatter, Series } from '$lib/types/blog';

/**
 * Type guard to validate that a file has the expected blog metadata structure
 */
export function isValidBlogFile(
	file: unknown,
	slug: string
): file is { metadata: Omit<Frontmatter, 'slug'> } {
	if (!file || typeof file !== 'object') {
		return false;
	}

	if (!('metadata' in file) || !file.metadata) {
		return false;
	}

	if (!slug || typeof slug !== 'string') {
		return false;
	}

	return true;
}

/**
 * Represents a parsed heading from HTML content
 */
export interface ParsedHeading {
	text: string | null;
	id: string;
	level: number;
}

/**
 * Regular expression to match H1-H6 heading tags in HTML
 */
const HEADING_REGEX = /<h[1-6][^>]*>.*?<\/h[1-6]>/g;

/**
 * Extracts structured heading data from HTML source string.
 * Only works in browser environment (requires DOMParser).
 *
 * @param source - HTML source string to parse
 * @returns Array of parsed headings with text, id, and level properties
 *
 * @example
 * const headings = getHeadings('<h2 id="intro">Introduction</h2>');
 * Returns: [{ text: 'Introduction', id: 'intro', level: 2 }]
 */
export function getHeadings(source: string): ParsedHeading[] {
	if (!isBrowserEnvironment()) {
		return [];
	}

	const headingMatches = source.match(HEADING_REGEX);

	if (!headingMatches) {
		return [];
	}

	return headingMatches.map(parseHeadingElement);
}

/**
 * Checks if code is running in a browser environment
 */
function isBrowserEnvironment(): boolean {
	return typeof window !== 'undefined';
}

/**
 * Parses a single heading HTML string into structured data
 */
function parseHeadingElement(headingHtml: string): ParsedHeading {
	const parser = new DOMParser();
	const doc = parser.parseFromString(headingHtml, 'text/html');
	const element = doc.body.firstChild as Element | null;

	if (!element) {
		return { text: null, id: '', level: 0 };
	}

	return {
		text: element.textContent,
		id: element.id,
		level: parseHeadingLevel(element.tagName)
	};
}

/**
 * Extracts the numeric level from a heading tag name (H1 -> 1, H2 -> 2, etc.)
 */
function parseHeadingLevel(tagName: string): number {
	const level = parseInt(tagName[1], 10);
	return isNaN(level) ? 0 : level;
}

/**
 * Extracts all unique tags from a list of blogs
 */
export function extractAllTags(blogs: Blog[]): string[] {
	const tagSet = new Set<string>();
	blogs.forEach((blog) => {
		blog.frontmatter.tags.forEach((tag) => tagSet.add(tag));
	});
	return Array.from(tagSet).sort();
}

/**
 * Groups blogs by their series
 */
export function groupBlogsBySeries(blogs: Blog[]): Map<string, Blog[]> {
	const seriesMap = new Map<string, Blog[]>();

	blogs.forEach((blog) => {
		const seriesSlug = blog.frontmatter.series;
		if (seriesSlug) {
			const existing = seriesMap.get(seriesSlug) || [];
			seriesMap.set(seriesSlug, [...existing, blog]);
		}
	});

	// Sort posts within each series by order
	seriesMap.forEach((posts, slug) => {
		seriesMap.set(
			slug,
			posts.sort((a, b) => (a.frontmatter.seriesOrder || 0) - (b.frontmatter.seriesOrder || 0))
		);
	});

	return seriesMap;
}

/**
 * Get series with their posts
 */
export function getSeries(blogs: Blog[]): Series[] {
	const grouped = groupBlogsBySeries(blogs);
	const series: Series[] = [];

	grouped.forEach((posts, slug) => {
		const config = seriesConfig.find((s) => s.slug === slug);
		if (config) {
			series.push({
				slug: config.slug,
				title: config.title,
				description: config.description,
				image: config.image,
				posts,
				totalPosts: posts.length
			});
		}
	});

	return series;
}

/**
 * Get standalone posts (not part of any series)
 */
export function getStandalonePosts(blogs: Blog[]): Blog[] {
	return blogs.filter((blog) => !blog.frontmatter.series);
}

/**
 * Filter blogs by search query and tags
 */
export function filterBlogs(
	blogs: Blog[],
	search: string,
	tags: string[],
	viewMode: 'all' | 'standalone' | 'series' = 'all'
): Blog[] {
	let filtered = blogs;

	// Filter by view mode
	if (viewMode === 'standalone') {
		filtered = filtered.filter((blog) => !blog.frontmatter.series);
	} else if (viewMode === 'series') {
		filtered = filtered.filter((blog) => !!blog.frontmatter.series);
	}

	// Filter by search
	if (search.trim()) {
		const searchLower = search.toLowerCase().trim();
		filtered = filtered.filter(
			(blog) =>
				blog.frontmatter.title.toLowerCase().includes(searchLower) ||
				blog.frontmatter.description.toLowerCase().includes(searchLower) ||
				blog.frontmatter.tags.some((tag) => tag.toLowerCase().includes(searchLower))
		);
	}

	// Filter by tags
	if (tags.length > 0) {
		filtered = filtered.filter((blog) => tags.every((tag) => blog.frontmatter.tags.includes(tag)));
	}

	return filtered;
}

/**
 * Get tag counts from blogs
 */
export function getTagCounts(blogs: Blog[]): Map<string, number> {
	const counts = new Map<string, number>();
	blogs.forEach((blog) => {
		blog.frontmatter.tags.forEach((tag) => {
			counts.set(tag, (counts.get(tag) || 0) + 1);
		});
	});
	return counts;
}

/**
 * Finds related posts based on shared tags
 * Returns posts sorted by number of shared tags (most relevant first)
 */
export function getRelatedPosts(
	currentSlug: string,
	currentTags: string[],
	allBlogs: Blog[],
	limit: number = 3
): Blog[] {
	if (!currentTags.length || !allBlogs.length) return [];

	const scoredPosts = allBlogs
		.filter((blog) => blog.slug !== currentSlug)
		.map((blog) => {
			const sharedTags = blog.frontmatter.tags.filter((tag) => currentTags.includes(tag));
			return {
				blog,
				score: sharedTags.length
			};
		})
		.filter((item) => item.score > 0)
		.sort((a, b) => {
			// Sort by score first, then by date
			if (b.score !== a.score) return b.score - a.score;
			return (
				new Date(b.blog.frontmatter.publishedAt).getTime() -
				new Date(a.blog.frontmatter.publishedAt).getTime()
			);
		});

	return scoredPosts.slice(0, limit).map((item) => item.blog);
}
