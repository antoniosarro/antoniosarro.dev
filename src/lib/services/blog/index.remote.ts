import { dev } from '$app/environment';
import { prerender } from '$app/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import type { Blog } from '$lib/types/blog';
import { calculateReadingTime } from '$lib/mdx/processor';

export const getBlogs = prerender(async (): Promise<Blog[]> => {
	try {
		const blogDir = path.join(process.cwd(), 'blog');
		const files = await fs.readdir(blogDir);

		const mdxFiles = files.filter((file) => file.endsWith('.mdx'));

		const articles = await Promise.all(
			mdxFiles.map(async (file) => {
				const filePath = path.join(blogDir, file);
				const fileContent = await fs.readFile(filePath, 'utf-8');
				const { data: frontmatter, content } = matter(fileContent);

				// Calculate reading time if not present
				if (!frontmatter.readingTime) {
					frontmatter.readingTime = calculateReadingTime(content);
				}

				const slug = file.replace(/\.mdx$/, '');

				return {
					slug,
					frontmatter: frontmatter as any
				};
			})
		);

		return articles.filter(isPublishableArticle).sort(sortByPublishDate);
	} catch (error) {
		console.error('Error fetching blog articles:', error);
		return [];
	}
});

function isPublishableArticle(blog: Blog | null): blog is Blog {
	return blog !== null && (!blog.frontmatter.draft || dev);
}

function sortByPublishDate(a: Blog, b: Blog): number {
	return (
		new Date(b.frontmatter.publishedAt).getTime() - new Date(a.frontmatter.publishedAt).getTime()
	);
}
