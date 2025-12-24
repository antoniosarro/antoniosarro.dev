import Matrix from '~icons/cib/matrix';
import X from '~icons/fa6-brands/square-x-twitter';
import Discord from '~icons/ic/baseline-discord';
import Mail from '~icons/material-symbols/mail-rounded';
import Github from '~icons/mdi/github';
import Linkedin from '~icons/mdi/linkedin';

import type { Component } from 'svelte';

export type Social = {
	name: string;
	url?: string;
	icon: Component;
};

export const mail: string = 'mailto:contact@antoniosarro.dev';

export const socials: Social[] = [
	{
		name: 'Github',
		url: 'https://github.com/antoniosarro',
		icon: Github
	},
	{
		name: 'X',
		url: 'https://x.com/_antoniosarro_',
		icon: X
	},
	{
		name: 'Linkedin',
		url: 'https://www.linkedin.com/in/antoniosarro99/',
		icon: Linkedin
	},
	{
		name: 'Discord',
		url: 'https://discord.com/users/297744171341709312',
		icon: Discord
	},
	{
		name: 'Matrix',
		url: 'https://matrix.to/#/@antoniosarro:matrix.org',
		icon: Matrix
	},
	{
		name: 'Mail',
		url: mail,
		icon: Mail
	}
];
