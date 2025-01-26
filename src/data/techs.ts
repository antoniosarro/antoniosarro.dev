export interface TechStack {
	href: string;
	icon: string;
	label: string;
	name: string;
}

export const footerTechStack: TechStack[] = [
	{
		href: 'https://kit.svelte.dev',
		icon: 'ri:svelte-fill',
		label: 'Built with SvelteKit',
		name: 'SvelteKit'
	},
	{
		href: 'https://www.typescriptlang.org',
		icon: 'teenyicons:typescript-outline',
		label: 'Built with TypeScript',
		name: 'TypeScript'
	},
	{
		href: 'https://tailwindcss.com',
		icon: 'mdi:tailwind',
		label: 'Styled with Tailwind CSS',
		name: 'TailwindCSS'
	}
];
