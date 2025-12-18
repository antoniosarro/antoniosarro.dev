import { getBlogs } from '$lib/services/blog/index.remote';
import type { RequestHandler } from './$types';

export const prerender = true;

const BASE_URL = 'https://antoniosarro.dev';
const SITE_TITLE = 'Antonio Sarro | Software Developer & Blogger';
const SITE_DESCRIPTION =
	'Passionate Geek Guy, Software Developer and Writer. Articles about software development, open source, and technology.';
const SITE_LANGUAGE = 'en-us';

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

	// Take only the 15 most recent posts
	const recentPosts = posts.slice(0, 15);

	const rssItems = recentPosts
		.map((post) => {
			const postUrl = `${BASE_URL}/blogs/${post.slug}`;
			const categories = post.frontmatter.tags
				.map((tag) => `    <category>${escapeXml(tag)}</category>`)
				.join('\n');

			return `  <item>
    <title>${escapeXml(post.frontmatter.title)}</title>
    <link>${postUrl}</link>
    <guid isPermaLink="true">${postUrl}</guid>
    <description>${escapeXml(post.frontmatter.description)}</description>
    <pubDate>${new Date(post.frontmatter.publishedAt).toUTCString()}</pubDate>
    <author>contact@antoniosarro.dev (Antonio Sarro)</author>
${categories}
  </item>`;
		})
		.join('\n');

	const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${BASE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>${SITE_LANGUAGE}</language>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>SvelteKit</generator>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>`;

	return new Response(rssXml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'max-age=3600, s-maxage=3600'
		}
	});
};
