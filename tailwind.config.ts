import type { Config } from 'tailwindcss';

export default {
	darkMode: ['selector', '[data-theme="dark"]'],
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				incognito: ['Incognito', 'sans-serif'],
				inter: ['Inter', 'sans-serif']
			},
			colors: {
				background: 'var(--background)',
				text: 'var(--text)',
				primary: 'var(--primary)',
				secondary: 'var(--secondary)',
				accent: 'var(--accent)',
				'elevation-one': 'var(--elevation-one)'
			},
			boxShadow: {
				line: 'var(--elevation-one) 0px 1px 0px'
			}
		}
	},

	plugins: []
} satisfies Config;
