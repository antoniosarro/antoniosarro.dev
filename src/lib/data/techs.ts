import RiSvelteFill from '~icons/ri/svelte-fill';
import TeenyiconsTypescriptOutline from '~icons/teenyicons/typescript-outline';
import MdiTailwind from '~icons/mdi/tailwind';

interface TechStack {
	href: string;
	icon: any;
	label: string;
	name: string;
}

export const footerTechStack: TechStack[] = [
	{
		href: 'https://kit.svelte.dev',
		icon: RiSvelteFill,
		label: 'Built with SvelteKit',
		name: 'SvelteKit'
	},
	{
		href: 'https://www.typescriptlang.org',
		icon: TeenyiconsTypescriptOutline,
		label: 'Built with TypeScript',
		name: 'TypeScript'
	},
	{
		href: 'https://tailwindcss.com',
		icon: MdiTailwind,
		label: 'Styled with Tailwind CSS',
		name: 'TailwindCSS'
	}
];
