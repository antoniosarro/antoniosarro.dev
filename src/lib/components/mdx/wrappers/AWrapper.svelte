<script lang="ts">
	import A from '../blueprints/a.svelte';

	let { href, html }: { href: string; html: string } = $props();
</script>

<A {href}>
	{@html html}
</A>
