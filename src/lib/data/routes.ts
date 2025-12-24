import Beaker from '~icons/heroicons-solid/beaker';
import Book from '~icons/lets-icons/book';
import History from '~icons/material-symbols/history';
import PersonOutlineRounded from '~icons/material-symbols/person-outline-rounded';
import Home from '~icons/material-symbols-light/home';

import type { Pathname } from '$app/types';
import type { Component } from 'svelte';

export interface Route {
	title: string;
	nav: string;
	path: Pathname;
	show: boolean;
	description: string;
	image: string;
	icon: Component | null;
	url: string;
	twitter: {
		image: string;
		imageAlt: string;
		site: string;
		creator: string;
		handle: string;
	};
}

export const routes: Route[] = [
	{
		title: 'Antonio Sarro | Software Developer',
		nav: 'Home',
		path: '/',
		show: false,
		description: 'Passionate Geek Guy, Software Developer and Writer',
		image: '',
		icon: Home,
		url: 'https://antoniosarro.dev/',
		twitter: {
			image: '',
			imageAlt: 'Antonio Sarro',
			site: '@_antoniosarro_',
			creator: '@_antoniosarro_',
			handle: '@_antoniosarro_'
		}
	},
	{
		title: 'About | Antonio Sarro',
		nav: 'About',
		path: '/about',
		show: true,
		description: 'Do you want to know more about me? This is the right place',
		image: '',
		icon: PersonOutlineRounded,
		url: 'https://antoniosarro.dev/about',
		twitter: {
			image: '',
			imageAlt: 'About',
			site: '@_antoniosarro_',
			creator: '@_antoniosarro_',
			handle: '@_antoniosarro_'
		}
	},
	{
		title: 'Projects | Antonio Sarro',
		nav: 'Projects',
		path: '/projects',
		show: true,
		description:
			'Learn about the projects I worked on, with an in-depth look at the technologies used',
		image: '',
		icon: Beaker,
		url: 'https://antoniosarro.dev/projects',
		twitter: {
			image: '',
			imageAlt: 'Projects',
			site: '@_antoniosarro_',
			creator: '@_antoniosarro_',
			handle: '@_antoniosarro_'
		}
	},
	{
		title: 'Blog | Antonio Sarro',
		nav: 'Blog',
		path: '/blogs',
		show: true,
		description:
			'Some articles I have written to share my knowledge and discoveries',
		image: '',
		icon: Book,
		url: 'https://antoniosarro.dev/blog',
		twitter: {
			image: '',
			imageAlt: 'Blog',
			site: '@_antoniosarro_',
			creator: '@_antoniosarro_',
			handle: '@_antoniosarro_'
		}
	},
	{
		title: 'Changelog | Antonio Sarro',
		nav: 'Changelog',
		path: '/changelog',
		show: false,
		description:
			'A detailed history of all changes and updates made to this website',
		image: '',
		icon: History,
		url: 'https://antoniosarro.dev/changelog',
		twitter: {
			image: '',
			imageAlt: 'Changelog',
			site: '@_antoniosarro_',
			creator: '@_antoniosarro_',
			handle: '@_antoniosarro_'
		}
	}
];
