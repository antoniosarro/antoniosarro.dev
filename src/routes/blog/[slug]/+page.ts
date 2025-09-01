import { error } from '@sveltejs/kit';

import type { Frontmatter } from '$types/blog';

import type { PageLoad } from './$types.js';

export const load: PageLoad = async ({ params, data }) => {
	let article;

	try {
		article = await import(`../../../../blog/${params.slug}.mdx`);
	} catch {
		error(404, 'post not found');
	}

	return {
		Content: article.default,
		frontmatter: article.metadata as Frontmatter,
		slug: data.slug,
		views: data.views
	};
};
