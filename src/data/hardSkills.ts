interface HardSkill {
	title: string;
	icon: string;
	href: string;
}

export interface HardSkills {
	key: string;
	items: HardSkill[];
}

export const hardSkills: HardSkills[] = [
	{
		key: 'Languages',
		items: [
			{
				title: 'Golang',
				icon: 'fa6-brands:golang',
				href: 'https://golang.org'
			},
			{
				title: 'Typescript',
				icon: 'teenyicons:typescript-outline',
				href: 'https://www.typescriptlang.org/'
			},
			{
				title: '.NET',
				icon: 'mdi:microsoft-dot-net',
				href: 'https://dotnet.microsoft.com'
			},
			{
				title: 'Bash',
				icon: 'devicon-plain:bash',
				href: 'https://www.gnu.org/software/bash/'
			}
		]
	},
	{
		key: 'Databases',
		items: [
			{
				title: 'Postgresql',
				icon: 'akar-icons:postgresql-fill',
				href: 'https://www.postgresql.org/'
			},
			{
				title: 'MySQL',
				icon: 'simple-icons:mysql',
				href: 'https://www.mysql.com/'
			},
			{
				title: 'SQLite',
				icon: 'simple-icons:sqlite',
				href: 'https://www.sqlite.org/index.html'
			},
			{
				title: 'Redis',
				icon: 'cib:redis',
				href: 'https://redis.io/'
			}
		]
	},
	{
		key: 'Frameworks',
		items: [
			{
				title: 'Svelte',
				icon: 'ri:svelte-fill',
				href: 'https://kit.svelte.dev/'
			},
			{
				title: 'Tailwind CSS',
				icon: 'lineicons:tailwindcss',
				href: 'https://tailwindcss.com/'
			},
			{
				title: 'NodeJs',
				icon: 'akar-icons:node-fill',
				href: 'https://nodejs.org/en/'
			},
			{
				title: 'Express',
				icon: 'simple-icons:express',
				href: 'https://expressjs.com/'
			},
			{
				title: 'React',
				icon: 'mdi:react',
				href: 'https://react.dev/'
			},
			{
				title: 'NextJs',
				icon: 'ri:nextjs-fill',
				href: 'https://nextjs.org/'
			}
		]
	},
	{
		key: 'Tools',
		items: [
			{
				title: 'Linux',
				icon: 'cib:linux',
				href: 'https://www.linux.org/'
			},
			{
				title: 'Docker',
				icon: 'mdi:docker',
				href: 'https://www.docker.com/'
			},
			{
				title: 'Git',
				icon: 'mdi:git',
				href: 'https://git-scm.com/'
			},
			{
				title: 'AWS',
				icon: 'mdi:aws',
				href: 'https://aws.amazon.com/'
			}
		]
	}
];
