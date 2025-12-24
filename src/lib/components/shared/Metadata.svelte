<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';

	import { page } from '$app/state';

	import { type Route, routes } from '$lib/data/routes';

	import type { Pathname } from '$app/types';
	import type { Frontmatter } from '$lib/types/blog';

	interface Props {
		frontmatter?: Frontmatter;
		slug?: string;
	}

	let { frontmatter, slug }: Props = $props();

	const SITE_NAME = 'Antonio Sarro';
	const TWITTER_HANDLE = '@_antoniosarro_';
	const BASE_URL = 'https://antoniosarro.dev';

	const DEFAULT_META: Route = {
		title: 'Page Not Found',
		nav: 'Page Not Found',
		path: '' as Pathname,
		show: false,
		description: '',
		url: BASE_URL,
		image: '',
		icon: null,
		twitter: {
			creator: TWITTER_HANDLE,
			handle: TWITTER_HANDLE,
			site: TWITTER_HANDLE,
			image: '',
			imageAlt: ''
		}
	};

	function createBlogMeta(
		frontmatter: Frontmatter,
		slug: string,
		pathname: string
	): Route {
		return {
			title: frontmatter.title,
			nav: frontmatter.title,
			path: pathname as Pathname,
			show: false,
			description: frontmatter.description,
			url: `${BASE_URL}/blogs/${slug}`,
			image: frontmatter.image || '',
			icon: null,
			twitter: {
				creator: TWITTER_HANDLE,
				handle: TWITTER_HANDLE,
				site: TWITTER_HANDLE,
				image: frontmatter.image || '',
				imageAlt: frontmatter.title
			}
		};
	}

	function getRouteMeta(pathname: string): Route {
		const route = routes.find((r) => r.path === pathname);
		if (route) return route;

		if (frontmatter && slug) {
			return createBlogMeta(frontmatter, slug, pathname);
		}

		return DEFAULT_META;
	}

	const currentMeta = $derived(getRouteMeta(page.url.pathname));
	const isBlogPost = $derived(!!frontmatter && !!slug);

	const ogImage = $derived({
		url: currentMeta.image || `${BASE_URL}/og-default.png`,
		width: 1200,
		height: 630,
		alt: currentMeta.twitter.imageAlt || currentMeta.title
	});
</script>

<svelte:head>
	{#if isBlogPost && frontmatter}
		<!-- Article-specific meta tags -->
		<meta property="article:published_time" content={frontmatter.publishedAt} />
		<meta property="article:author" content="Antonio Sarro" />
		{#each frontmatter.tags as tag (tag)}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}
</svelte:head>

<MetaTags
	title={currentMeta.title}
	description={currentMeta.description}
	canonical={currentMeta.url}
	openGraph={{
		url: currentMeta.url,
		title: currentMeta.title,
		description: currentMeta.description,
		images: [ogImage],
		siteName: SITE_NAME,
		type: isBlogPost ? 'article' : 'website'
	}}
	twitter={{
		cardType: 'summary_large_image',
		site: TWITTER_HANDLE,
		creator: TWITTER_HANDLE,
		title: currentMeta.title,
		description: currentMeta.description,
		image: ogImage.url,
		imageAlt: ogImage.alt
	}} />
