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
				background: 'rgb(var(--background) / <alpha-value>)',
				text: 'rgb(var(--text) / <alpha-value>)',
				primary: 'rgb(var(--primary) / <alpha-value>)',
				secondary: 'rgb(var(--secondary) / <alpha-value>)',
				accent: 'rgb(var(--accent) / <alpha-value>)',
				'elevation-one': 'rgb(var(--elevation-one) / <alpha-value>)'
			},
			boxShadow: {
				line: 'var(--elevation-one) 0px 1px 0px'
			}
		}
	},

	plugins: []
} satisfies Config;
