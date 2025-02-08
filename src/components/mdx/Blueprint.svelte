<script module>
	import './markdown.pcss';

	import { a, h2, h3, pre, ul } from './blueprint';
	export { a, h2, h3, pre, ul };
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
</script>

{@render children()}
