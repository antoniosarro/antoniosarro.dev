import { error } from '@sveltejs/kit';

import { trackPostView } from '$lib/server/views.js';

import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params, request }) => {
	// Verify the MDX file exists before tracking views
	try {
		await import(`../../../../blog/${params.slug}.mdx`);
	} catch {
		error(404, 'post not found');
	}

	// Track the view
	const userAgent = request.headers.get('user-agent');
	const views = trackPostView(params.slug, userAgent);

	return {
		slug: params.slug,
		views
	};
};
