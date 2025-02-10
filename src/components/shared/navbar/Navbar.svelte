<script lang="ts">
	import { routes } from '$data/routes';

	import Logo from './Logo.svelte';
	import Mobile from './Mobile.svelte';
	import Theme from './Theme.svelte';
</script>

<header class="z-30 mb-10 border-b border-elevation-one px-6 py-6 text-sm md:mb-28 md:px-16">
	<div class="mx-auto flex max-w-6xl items-center justify-between">
		<a href="/" aria-label="logo" class="fill-text">
			<Logo />
		</a>
		<nav class="hidden md:block">
			<ul class="flex items-center gap-x-8">
				{#each routes as { nav, path, show }}
					{#if show}
						<li>
							<a
								class="font-incognito text-lg text-text duration-300 hover:text-primary"
								href={path}>{nav}</a
							>
						</li>
					{/if}
				{/each}
			</ul>
		</nav>
		<div class="flex items-center gap-x-4">
			<Theme />
			<Mobile />
		</div>
	</div>
</header>
