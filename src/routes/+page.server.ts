import { getBatchViews } from '$lib/server/views.js';
import { getBlogs } from '$lib/services/blog';
import { getGithubContributions } from '$lib/services/github/contribution';
import { getGithubProjects } from '$lib/services/github/repository';

import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
	const articles = await getBlogs();
	const slugs = articles.map((article) => article.slug);
	const viewsMap = getBatchViews(slugs);

	return {
		github: getGithubContributions(),
		projects: getGithubProjects(),
		articles: articles.map((article) => ({
			...article,
			views: viewsMap[article.slug] || 0
		}))
	};
};
