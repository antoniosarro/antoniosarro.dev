<script lang="ts">
	import 'iconify-icon';

	import { routes } from '$data/routes';

	import Logo from './Logo.svelte';

	let show = $state(false);

	function onToggleNav() {
		if (show) {
			document.body.style.overflow = 'auto';
		} else {
			document.body.style.overflow = 'hidden';
		}
		show = !show;
	}
</script>

<button
	class="flex rounded-md border border-elevation-one p-2 md:hidden"
	aria-label="Toggle Menu"
	onclick={onToggleNav}
>
	<iconify-icon noobserver height="20" width="20" class="flex" icon="solar:hamburger-menu-outline"
	></iconify-icon>
</button>
<div
	class="fixed left-0 top-0 z-10 h-full w-full transform bg-background duration-500 ease-[cubic-bezier(0.7,0,0,1)] md:hidden {show
		? 'translate-x-0 rounded-none'
		: 'translate-x-full'}"
>
	<div class="mt-6 flex items-center justify-between px-8">
		<a href="/" aria-label="Logo" class="fill-text" onclick={onToggleNav}>
			<Logo />
		</a>
		<button
			aria-label="Toggle Menu"
			onclick={onToggleNav}
			class="rounded-full border border-elevation-one p-2 duration-500 md:hidden {!show
				? '-rotate-[360deg]'
				: null}"
		>
			<iconify-icon noobserver height="20" width="20" class="flex" icon="radix-icons:cross-2"
			></iconify-icon>
		</button>
	</div>
	<nav class="mt-6 flex flex-col">
		{#each routes as { title, path, show, icon }}
			{#if show}
				<a
					class="group flex items-center gap-x-2 p-6 font-incognito text-lg font-semibold shadow-line"
					aria-label={title}
					href={path}
					onclick={() => onToggleNav()}
				>
					<iconify-icon noobserver height="20" width="20" class="flex" {icon}></iconify-icon>
					{title}
				</a>
			{/if}
		{/each}
	</nav>
</div>
