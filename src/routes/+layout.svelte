<script lang="ts">
	import '$styles/app.css';

	import { Toaster } from 'svelte-sonner';

	import { Footer } from '$components/shared/footer';
	import { Cursor, Umami } from '$components/shared/misc';
	import { Navbar } from '$components/shared/navbar';
	import { env } from '$env/dynamic/public';
	import { darkMode } from '$lib/stores/dark.svelte';

	let { children } = $props();
</script>

<Umami
	websiteID={env.PUBLIC_UMAMI_WEBSITE_ID}
	srcURL={env.PUBLIC_UMAMI_SERVER_REMOTE}
	configuration={{
		'data-cache': true
	}}
/>
<Toaster position="bottom-center" theme={$darkMode ? 'dark' : 'light'} />
<Cursor />

<Navbar />
{@render children()}
<Footer />
