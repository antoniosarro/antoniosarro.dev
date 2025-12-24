import Node from '~icons/akar-icons/node-fill';
import Postgresql from '~icons/akar-icons/postgresql-fill';
import Linux from '~icons/cib/linux';
import Redis from '~icons/cib/redis';
import Bash from '~icons/devicon-plain/bash';
import Golang from '~icons/fa6-brands/golang';
import Tailwindcss from '~icons/lineicons/tailwindcss';
import Aws from '~icons/mdi/aws';
import Docker from '~icons/mdi/docker';
import Git from '~icons/mdi/git';
import DotNet from '~icons/mdi/microsoft-dot-net';
import React from '~icons/mdi/react';
import Nextjs from '~icons/ri/nextjs-fill';
import Svelte from '~icons/ri/svelte-fill';
import Express from '~icons/simple-icons/express';
import MySQL from '~icons/simple-icons/mysql';
import SQLite from '~icons/simple-icons/sqlite';
import Typescript from '~icons/teenyicons/typescript-outline';

import type { Component } from 'svelte';

interface HardSkill {
	title: string;
	icon: Component;
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
				icon: Golang,
				href: 'https://golang.org'
			},
			{
				title: 'Typescript',
				icon: Typescript,
				href: 'https://www.typescriptlang.org/'
			},
			{
				title: '.NET',
				icon: DotNet,
				href: 'https://dotnet.microsoft.com'
			},
			{
				title: 'Bash',
				icon: Bash,
				href: 'https://www.gnu.org/software/bash/'
			}
		]
	},
	{
		key: 'Databases',
		items: [
			{
				title: 'Postgresql',
				icon: Postgresql,
				href: 'https://www.postgresql.org/'
			},
			{
				title: 'MySQL',
				icon: MySQL,
				href: 'https://www.mysql.com/'
			},
			{
				title: 'SQLite',
				icon: SQLite,
				href: 'https://www.sqlite.org/index.html'
			},
			{
				title: 'Redis',
				icon: Redis,
				href: 'https://redis.io/'
			}
		]
	},
	{
		key: 'Frameworks',
		items: [
			{
				title: 'Svelte',
				icon: Svelte,
				href: 'https://kit.svelte.dev/'
			},
			{
				title: 'Tailwind CSS',
				icon: Tailwindcss,
				href: 'https://tailwindcss.com/'
			},
			{
				title: 'NodeJs',
				icon: Node,
				href: 'https://nodejs.org/en/'
			},
			{
				title: 'Express',
				icon: Express,
				href: 'https://expressjs.com/'
			},
			{
				title: 'React',
				icon: React,
				href: 'https://react.dev/'
			},
			{
				title: 'NextJs',
				icon: Nextjs,
				href: 'https://nextjs.org/'
			}
		]
	},
	{
		key: 'Tools',
		items: [
			{
				title: 'Linux',
				icon: Linux,
				href: 'https://www.linux.org/'
			},
			{
				title: 'Docker',
				icon: Docker,
				href: 'https://www.docker.com/'
			},
			{
				title: 'Git',
				icon: Git,
				href: 'https://git-scm.com/'
			},
			{
				title: 'AWS',
				icon: Aws,
				href: 'https://aws.amazon.com/'
			}
		]
	}
];
