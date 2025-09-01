import { getBatchViews } from '$lib/server/views.js';
import { getBlogs } from '$lib/services/blog';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const articles = await getBlogs();
	const slugs = articles.map((article) => article.slug);
	const viewsMap = getBatchViews(slugs);

	return {
		articles: articles.map((article) => ({
			...article,
			views: viewsMap[article.slug] || 0
		}))
	};
};
