export const THEMES = {
	LIGHT: 'light',
	DARK: 'dark'
} as const;

export type Theme = (typeof THEMES)[keyof typeof THEMES];

export const COOKIE_CONFIG = {
	name: 'theme',
	maxAge: 31_536_000, // 1 year
	sameSite: 'lax', // More secure default
	path: '/',
	secure: true
} as const;

export const ATTRIBUTE = 'data-theme' as const;
