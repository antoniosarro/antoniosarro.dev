import { getBlogs } from '$lib/services/blog';

import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async () => {
	return {
		articles: getBlogs()
	};
};
