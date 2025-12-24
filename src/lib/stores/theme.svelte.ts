import { ATTRIBUTE, COOKIE_CONFIG, THEMES } from '$lib/constants/theme';

class DarkModeManager {
	#value = $state<boolean | null>(null);
	#mediaQuery: MediaQueryList | null = null;
	#cleanup: (() => void) | null = null;

	get value() {
		return this.#value;
	}

	set value(newValue: boolean | null) {
		this.#value = newValue;
	}

	init() {
		const attributeTheme = this.#getThemeFromAttribute();
		if (attributeTheme !== null) {
			this.#value = attributeTheme;
			return;
		}

		this.#mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		this.#value = this.#mediaQuery.matches;
		this.#apply();

		const handleChange = (e: MediaQueryListEvent) => {
			this.#value = e.matches;
			this.#apply();
		};

		this.#mediaQuery.addEventListener('change', handleChange);
		this.#cleanup = () =>
			this.#mediaQuery?.removeEventListener('change', handleChange);
	}

	toggle() {
		this.#value = !this.#value;
		this.#apply();
	}

	destroy() {
		this.#cleanup?.();
	}

	#getThemeFromAttribute(): boolean | null {
		const theme = document.documentElement.getAttribute(ATTRIBUTE);
		if (theme === THEMES.DARK) return true;
		if (theme === THEMES.LIGHT) return false;
		return null;
	}

	#apply() {
		if (this.#value === null) return;

		const theme = this.#value ? THEMES.DARK : THEMES.LIGHT;

		const cookieParts = Object.entries(COOKIE_CONFIG)
			.filter(([key, value]) => key !== 'name' && value !== undefined)
			.map(([key, value]) => `${key}=${value}`);

		document.cookie = `${COOKIE_CONFIG.name}=${theme}; ${cookieParts.join('; ')}`;

		document.documentElement.setAttribute(ATTRIBUTE, theme);
	}
}

export const darkMode = new DarkModeManager();
