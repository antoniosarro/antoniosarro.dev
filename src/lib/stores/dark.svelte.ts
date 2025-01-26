import { get, writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { THEMES, COOKIE_CONFIG, BODY_ATTRIBUTE } from '$lib/constants/theme';

export const darkMode: Writable<boolean | null> = writable(null);

const getThemeFromAttribute = (): boolean | null => {
	const theme = document.body.getAttribute(BODY_ATTRIBUTE);
	if (theme === THEMES.DARK) return true;
	if (theme === THEMES.LIGHT) return false;
	return null;
};

export const initDarkMode = () => {
	// First check body attribute
	const attributeTheme = getThemeFromAttribute();
	if (attributeTheme !== null) {
		darkMode.set(attributeTheme);
		return;
	}

	// Then check system preference
	const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
	darkMode.set(prefersDarkMode.matches);
	performDarkMode();

	// Add listener for system preference changes
	const handleChange = (e: MediaQueryListEvent) => {
		darkMode.set(e.matches);
		performDarkMode();
	};

	prefersDarkMode.addEventListener('change', handleChange);
	return () => prefersDarkMode.removeEventListener('change', handleChange); // Cleanup
};

export const toggleDarkMode = () => {
	darkMode.update((theme) => !theme);
	performDarkMode();
};

export const performDarkMode = () => {
	const theme = get(darkMode);
	if (theme !== null) {
		const cookieTheme = theme ? THEMES.DARK : THEMES.LIGHT;

		// Set cookie with correct name and value format
		document.cookie = `${COOKIE_CONFIG.name}=${cookieTheme}; ${Object.entries({
			...COOKIE_CONFIG,
			name: undefined,
			value: undefined
		})
			.filter(([, value]) => value !== undefined)
			.map(([key, value]) => `${key}=${value}`)
			.join('; ')}`;

		// Set body attribute
		document.body.setAttribute(BODY_ATTRIBUTE, cookieTheme);
	}
};
