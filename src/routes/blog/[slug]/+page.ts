import { error } from '@sveltejs/kit';

import type { Frontmatter } from '$types/blog';

export const load = async ({ params }) => {
	let article;

	try {
		article = await import(`../../../../blog/${params.slug}.mdx`);
	} catch {
		error(404, 'post not found');
	}

	return {
		Content: article.default,
		slug: params.slug,
		frontmatter: article.metadata as Frontmatter
	};
};
