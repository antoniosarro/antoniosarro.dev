import { getGithubProjects } from '$lib/services/github/repository';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		projects: getGithubProjects()
	};
};
