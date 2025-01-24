import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				incognito: ["var(--incognito)"],
				inter: ["var(--inter)"],
			},
		}
	},
	
	plugins: []
} satisfies Config;
