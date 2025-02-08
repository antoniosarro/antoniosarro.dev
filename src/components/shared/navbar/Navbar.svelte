<script lang="ts">
	import { routes } from '$data/routes';

	import Logo from './Logo.svelte';
	import Mobile from './Mobile.svelte';
	import Theme from './Theme.svelte';
</script>

<header class="z-30 mb-10 text-sm">
	<div class="mx-auto flex items-center justify-between">
		<a href="/" aria-label="logo" class="fill-text">
			<Logo />
		</a>

		<nav class="hidden md:block">
			<ul class="flex items-center gap-x-8">
				{#each routes as { title, path, show }}
					{#if show}
						<li>
							<a
								class="font-incognito text-lg text-text duration-300 hover:text-primary"
								href={path}>{title}</a
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
