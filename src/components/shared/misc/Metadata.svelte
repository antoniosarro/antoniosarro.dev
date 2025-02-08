<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';

	import { page } from '$app/state';
	import { type Route, routes } from '$data/routes';
	import type { Frontmatter } from '$types/blog';

	let { frontmatter, slug }: { frontmatter?: Frontmatter; slug?: string } = $props();

	function getRouteMeta(pathname: string): Route {
		const route = routes.find((route) => route.url.endsWith(pathname));
		if (!route) {
			if (frontmatter && slug) {
				return {
					title: frontmatter.title,
					path: pathname,
					show: false,
					description: frontmatter.description,
					url: 'https://antoniosarro.dev/blog/' + slug,
					image: '',
					icon: 'lets-icons:book',
					twitter: {
						creator: '@_antoniosarro_',
						handle: '@_antoniosarro_',
						site: '@_antoniosarro_',
						image: '',
						imageAlt: 'Blog'
					}
				};
			}
			// Return default route values if no match found
			return {
				title: 'Page Not Found',
				path: pathname,
				show: false,
				description: '',
				url: '',
				image: '',
				icon: '',
				twitter: {
					creator: '',
					handle: '',
					site: '',
					image: '',
					imageAlt: ''
				}
			};
		}
		return route;
	}

	let currentMeta: Route = $derived(getRouteMeta(page.url.pathname));
</script>

<MetaTags
	title={currentMeta.title}
	titleTemplate="%s | Antonio Sarro"
	description={currentMeta.description}
	canonical={currentMeta.url}
	openGraph={{
		url: currentMeta.url,
		title: currentMeta.title,
		description: currentMeta.description,
		images: [
			{
				url: currentMeta.image,
				width: 800,
				height: 600,
				alt: 'Og Image Alt'
			}
		],
		siteName: 'Antonio Sarro'
	}}
	twitter={{
		creator: currentMeta.twitter?.handle || '@handle',
		site: currentMeta.twitter?.site || '@site',
		cardType: 'summary_large_image',
		title: `${currentMeta.title} | Antonio Sarro`,
		description: currentMeta.description,
		image: currentMeta.twitter?.image || currentMeta.image,
		imageAlt: currentMeta.twitter?.imageAlt || 'Twitter image alt'
	}}
/>
