import { getGithubContributions } from '$utils/github.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
	return {
		github: getGithubContributions()
	};
};
