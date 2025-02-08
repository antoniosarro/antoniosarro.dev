import type { Blog } from '$types/blog';
import { isValidBlogFile } from '$utils/blog';

export async function getBlogs() {
	try {
		const mdxPaths = import.meta.glob('/blog/*.mdx', { eager: true });
		const articles: Blog[] = Object.entries(mdxPaths)
			.map(([path, file]) => {
				const slug = path.split('/').slice(2)[0].split('.')[0];
				if (!isValidBlogFile(file, slug)) {
					return null;
				}
				const frontmatter = file.metadata;
				return { frontmatter, slug } as Blog;
			})
			.filter((blog): blog is Blog => blog !== null && !blog.frontmatter.draft)
			.sort(
				(a, b) =>
					new Date(b.frontmatter.publishedAt).getTime() -
					new Date(a.frontmatter.publishedAt).getTime()
			);
		return articles;
	} catch (error) {
		console.error('Error fetching blog articles:', error);
		return [];
	}
}
