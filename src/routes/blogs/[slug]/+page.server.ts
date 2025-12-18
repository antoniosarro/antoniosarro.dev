import path from 'path';
import fs from 'fs/promises';
import matter from 'gray-matter';
import type { EntryGenerator, PageServerLoad } from './$types';
import { processMDX, calculateReadingTime, type ProcessedContent } from '$lib/mdx/processor';
import { error } from '@sveltejs/kit';
import type { Blog, Frontmatter } from '$lib/types/blog';
import { getBlogs } from '$lib/services/blog/index.remote';

export interface BlogPageData {
	content: ProcessedContent;
	slug: string;
	frontmatter: Frontmatter;
	allBlogs: Blog[];
}

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;
	const mdxPath = path.join(process.cwd(), 'blog', `${slug}.mdx`);

	try {
		const fileContent = await fs.readFile(mdxPath, 'utf-8');
		const { content: markdownContent, data: frontmatter } = matter(fileContent);

		if (!frontmatter.readingTime) {
			frontmatter.readingTime = calculateReadingTime(markdownContent);
		}

		const content = await processMDX(markdownContent);

		// Fetch all blogs for series navigation
		const allBlogs = await getBlogs();

		return {
			content,
			slug,
			frontmatter: frontmatter as Frontmatter,
			allBlogs
		} satisfies BlogPageData;
	} catch (e) {
		console.error(`\n❌ Failed to load ${slug}:`, e);
		throw error(404, 'Post not found');
	}
};

export const prerender = true;

export const entries: EntryGenerator = () => {
	return [
		{ slug: 'building-spotify-now-playing' },
		{ slug: 'forgejo-homelab' },
		{ slug: 'opinion-factory' },
		{ slug: 'umami-analytics-sveltekit' },
		{ slug: 'building-portfolio' }
	];
};
