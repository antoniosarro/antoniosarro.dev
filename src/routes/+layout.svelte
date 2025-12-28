<script lang="ts">
	import '../app.css';

	import { Toaster } from 'svelte-sonner';

	import { onNavigate } from '$app/navigation';
	import {
		PUBLIC_UMAMI_SERVER_REMOTE,
		PUBLIC_UMAMI_WEBSITE_ID
	} from '$env/static/public';

	import favicon from '$lib/assets/favicon.svg';
	import { Footer } from '$lib/components/layout/footer';
	import { Navbar } from '$lib/components/layout/navbar';
	import { Cursor, Umami } from '$lib/components/shared';
	import Fireworks from '$lib/components/shared/effects/Fireworks.svelte';
	import Snow from '$lib/components/shared/effects/Snow.svelte';
	import { darkMode } from '$lib/stores/theme.svelte';

	import type { Snippet } from 'svelte';

	const { children }: { children?: Snippet } = $props();

	$effect(() => {
		darkMode.init();
	});

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link
		rel="alternate"
		type="application/rss+xml"
		title="Antonio Sarro RSS Feed"
		href="/rss.xml" />
	<link
		rel="alternate"
		type="application/rss+xml"
		title="Antonio Sarro Blog"
		href="https://antoniosarro.dev/rss.xml" />
	<link
		rel="alternate"
		type="application/atom+xml"
		title="Antonio Sarro Blog (Atom)"
		href="https://antoniosarro.dev/rss.xml" />
</svelte:head>

{#if PUBLIC_UMAMI_WEBSITE_ID && PUBLIC_UMAMI_SERVER_REMOTE}
	<Umami
		websiteID={PUBLIC_UMAMI_WEBSITE_ID}
		srcURL={PUBLIC_UMAMI_SERVER_REMOTE} />
{/if}

<Toaster position="bottom-center" theme={darkMode.value ? 'dark' : 'light'} />
<Cursor />

<Snow />
<Fireworks />

<Navbar />
{#if children}
	{@render children()}
{/if}
<Footer />
