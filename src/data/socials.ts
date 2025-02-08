export type Social = {
	name: string;
	url?: string;
	icon: string;
};

export const mail: string = 'mailto:contact@antoniosarro.dev';

export const socials: Social[] = [
	{
		name: 'Github',
		url: 'https://github.com/antoniosarro',
		icon: 'mdi:github'
	},
	{
		name: 'X',
		url: 'https://x.com/_antoniosarro_',
		icon: 'fa6-brands:square-x-twitter'
	},
	{
		name: 'Linkedin',
		url: 'https://www.linkedin.com/in/antoniosarro99/',
		icon: 'mdi:linkedin'
	},
	{
		name: 'Discord',
		url: 'https://discord.com/users/297744171341709312',
		icon: 'ic:baseline-discord'
	},
	{
		name: 'Matrix',
		url: 'https://matrix.to/#/@antoniosarro:matrix.org',
		icon: 'cib:matrix'
	},
	{
		name: 'Mail',
		url: mail,
		icon: 'material-symbols:mail-rounded'
	}
];
