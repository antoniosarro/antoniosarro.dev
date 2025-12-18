import { getBlogs } from '$lib/services/blog/index.remote';
import type { RequestHandler } from './$types';

export const prerender = true;

const BASE_URL = 'https://antoniosarro.dev';

function escapeXml(unsafe: string): string {
	return unsafe
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export const GET: RequestHandler = async () => {
	const posts = await getBlogs();

	const staticPages = [
		{
			loc: BASE_URL,
			lastmod: new Date().toISOString(),
			changefreq: 'weekly',
			priority: '1.0'
		},
		{
			loc: `${BASE_URL}/about`,
			lastmod: new Date().toISOString(),
			changefreq: 'monthly',
			priority: '0.8'
		},
		{
			loc: `${BASE_URL}/projects`,
			lastmod: new Date().toISOString(),
			changefreq: 'weekly',
			priority: '0.9'
		},
		{
			loc: `${BASE_URL}/blogs`,
			lastmod: new Date().toISOString(),
			changefreq: 'weekly',
			priority: '0.9'
		}
	];

	const blogPages = posts.map((post) => ({
		loc: `${BASE_URL}/blogs/${post.slug}`,
		lastmod: new Date(post.frontmatter.publishedAt).toISOString(),
		changefreq: 'monthly',
		priority: '0.7'
	}));

	const allPages = [...staticPages, ...blogPages];

	const urlEntries = allPages
		.map(
			(page) => `  <url>
    <loc>${escapeXml(page.loc)}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
		)
		.join('\n');

	const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="https://www.w3.org/1999/xhtml"
        xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="https://www.google.com/schemas/sitemap-video/1.1">
${urlEntries}
</urlset>`;

	return new Response(sitemapXml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'max-age=3600, s-maxage=3600'
		}
	});
};
