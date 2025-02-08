<script lang="ts">
	import '$styles/app.css';

	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-sonner';

	import { onNavigate } from '$app/navigation';
	import { Footer } from '$components/shared/footer';
	import { Cursor, Umami } from '$components/shared/misc';
	import { Navbar } from '$components/shared/navbar';
	import { env } from '$env/dynamic/public';
	import { darkMode } from '$lib/stores/dark.svelte';

	let { children } = $props();

	// Handle page transitions
	const preparePageTransition = () => {
		onNavigate((navigation) => {
			if (!document.startViewTransition) return;

			return new Promise((resolve) => {
				document.startViewTransition(async () => {
					resolve();
					await navigation.complete;
				});
			});
		});
	};

	onMount(preparePageTransition);
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

<!-- Mobile Layout -->
<div class="container mx-auto min-h-screen px-6 py-4 sm:hidden">
	<Navbar />
	<main class="flex-grow">
		{@render children()}
	</main>
	<Footer />
</div>

<!-- Desktop Layout -->
<div
	class="container mx-auto hidden min-h-screen flex-col items-center justify-center gap-4 px-6 py-4 sm:flex"
>
	<h1 class="text-center text-5xl font-bold">
		I'm currently making some exciting improvements to my website!
	</h1>
	<h2 class="text-center text-xl opacity-80">
		For now, it's optimized only on mobile devices.<br />
		Please access it from your smartphone for the best experience.
	</h2>
</div>
