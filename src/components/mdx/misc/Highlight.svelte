<script lang="ts">
	import 'iconify-icon';

	import type { Snippet } from 'svelte';
	interface Props {
		title: string;
		variant: 'success' | 'warning' | 'error';
		children: Snippet;
	}

	let { title, variant, children }: Props = $props();
</script>

<aside
	class="{variant} relative mb-6 flex flex-col items-start justify-start rounded-lg border-l-4 px-4 py-2"
>
	<div class="icon absolute right-2 top-2 -z-10 text-7xl text-inherit opacity-20">
		{#if variant === 'success'}
			<iconify-icon noobserver icon="ep:success-filled"></iconify-icon>
		{:else if variant === 'warning'}
			<iconify-icon noobserver icon="zondicons:exclamation-solid"></iconify-icon>
		{:else if variant === 'error'}
			<iconify-icon noobserver icon="fluent-mdl2:status-error-full"></iconify-icon>
		{/if}
	</div>
	<span class="text-white-500 font-bold">{title}</span>
	<div>
		{@render children()}
	</div>
</aside>

<style lang="postcss">
	aside {
		&.success {
			@apply border-green-600 bg-green-300 bg-opacity-15 text-green-600;
		}

		&.error {
			@apply border-red-600 bg-red-300 bg-opacity-15 text-red-600;
		}

		&.warning {
			@apply border-yellow-600 bg-yellow-300 bg-opacity-15 text-yellow-600;
		}
	}
</style>
