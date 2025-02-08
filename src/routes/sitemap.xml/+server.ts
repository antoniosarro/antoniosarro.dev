import type { RequestHandler } from '@sveltejs/kit';
import * as sitemap from 'super-sitemap';

import { getBlogs } from '$lib/services/blog';

export const GET: RequestHandler = async ({ url }) => {
	const articles = await getBlogs();

	return await sitemap.response({
		origin: url.origin,
		paramValues: {
			'/blog/[slug]': articles.map((article) => {
				return {
					values: [article.slug],
					lastmod: article.frontmatter.updateAt
				};
			})
		}
	});
};
