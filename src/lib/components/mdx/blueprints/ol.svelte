<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		children,
		...restProps
	}: HTMLAttributes<HTMLOListElement> & {
		children: Snippet;
	} = $props();
</script>

<ol class="mb-4 ml-5 list-decimal" {...restProps}>
	{@render children()}
</ol>
