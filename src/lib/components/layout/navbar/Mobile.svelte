<script lang="ts">
	import Cross from '~icons/radix-icons/cross-2';
	import HamburgerMenuOutline from '~icons/solar/hamburger-menu-outline';

	import { resolve } from '$app/paths';

	import { routes } from '$lib/data/routes';

	import Logo from './Logo.svelte';

	let show = $state(false);
	const visibleRoutes = routes.filter((route) => route.show);

	function toggleNav() {
		show = !show;
		document.body.style.overflow = show ? 'hidden' : 'auto';
	}

	$effect(() => {
		return () => {
			document.body.style.overflow = 'auto';
		};
	});
</script>

<button
	class="border-elevation-one flex rounded-md border p-2 md:hidden"
	aria-label="Toggle navigation menu"
	aria-expanded={show}
	onclick={toggleNav}>
	<HamburgerMenuOutline height={20} width={20} class="flex" />
</button>

<div
	class="bg-background fixed top-0 left-0 z-10 h-full w-full transform duration-500 ease-[cubic-bezier(0.7,0,0,1)] md:hidden"
	class:translate-x-0={show}
	class:translate-x-full={!show}
	role="dialog"
	aria-modal={show}
	aria-hidden={!show}>
	<div class="mt-6 flex items-center justify-between px-8">
		<a
			href={resolve('/')}
			aria-label="Home page logo"
			class="fill-foreground"
			onclick={toggleNav}>
			<Logo />
		</a>
		<button
			aria-label="Close navigation menu"
			onclick={toggleNav}
			class="border-elevation-one rounded-full border p-2 duration-500 md:hidden"
			class:-rotate-[360deg]={!show}>
			<Cross height={20} width={20} class="flex" />
		</button>
	</div>
	<nav class="mt-6 flex flex-col" aria-label="Mobile navigation">
		{#each visibleRoutes as { path, icon, nav } (path)}
			{@const Icon = icon}
			<a
				class="group shadow-line flex items-center gap-x-2 p-6 text-lg font-semibold"
				aria-label={nav}
				href={resolve(path)}
				onclick={toggleNav}>
				<Icon class="flex" width={20} height={20} />
				{nav}
			</a>
		{/each}
	</nav>
</div>
