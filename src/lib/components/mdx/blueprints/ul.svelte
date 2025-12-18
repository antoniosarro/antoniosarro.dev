<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		children,
		...restProps
	}: HTMLAttributes<HTMLUListElement> & {
		children: Snippet;
	} = $props();
</script>

<ul class="mb-4 ml-5 list-[square]" {...restProps}>
	{@render children()}
</ul>
