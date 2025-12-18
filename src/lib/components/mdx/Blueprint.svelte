<script module>
	import './markdown.css';
	export { a, h2, h3, pre, ul, ol } from './blueprints';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
</script>

{@render children()}
