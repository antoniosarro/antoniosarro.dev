import { getBlogs } from '$lib/services/blog';
import { getGithubContributions } from '$lib/services/github/contribution';
import { getGithubProjects } from '$lib/services/github/repository';

import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
	return {
		github: getGithubContributions(),
		projects: getGithubProjects(),
		articles: getBlogs()
	};
};
