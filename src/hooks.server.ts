import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { type Theme, THEMES } from '$lib/constants/theme';

function isValidTheme(theme: string): theme is Theme {
	return Object.values(THEMES).includes(theme as Theme);
}

const getCookies: Handle = async ({ event, resolve }) => {
	const theme = event.cookies.get('theme');

	if (theme && isValidTheme(theme)) {
		return await resolve(event, {
			transformPageChunk: ({ html }) => {
				return html.replace('data-theme=""', `data-theme="${theme}"`);
			}
		});
	}

	return await resolve(event);
};

const preloadResources: Handle = async ({ event, resolve }) => {
	return await resolve(event, {
		preload: ({ type }) => {
			return type === 'font' || type === 'js' || type === 'css';
		}
	});
};

export const handle: Handle = sequence(preloadResources, getCookies);
