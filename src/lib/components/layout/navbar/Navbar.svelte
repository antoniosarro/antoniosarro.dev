<script lang="ts">
	import { resolve } from '$app/paths';

	import { routes } from '$lib/data/routes';

	import Logo from './Logo.svelte';
	import Mobile from './Mobile.svelte';
	import Theme from './Theme.svelte';

	const visibleRoutes = routes.filter((route) => route.show);
</script>

<header
	class="border-elevation-one z-30 mb-10 border-b px-6 py-6 text-sm md:mb-28 md:px-16">
	<div class="mx-auto flex max-w-6xl items-center justify-between">
		<a href={resolve('/')} aria-label="Home page logo" class="fill-foreground">
			<Logo />
		</a>
		<nav class="hidden md:block" aria-label="Main navigation">
			<ul class="flex items-center gap-x-8">
				{#each visibleRoutes as { nav, path } (path)}
					<li>
						<a
							class="font-incognito text-foreground hover:text-primary text-lg duration-300"
							href={resolve(path)}>
							{nav}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
		<div class="flex items-center gap-x-4">
			<!-- <Theme /> -->
			<Mobile />
		</div>
	</div>
</header>
