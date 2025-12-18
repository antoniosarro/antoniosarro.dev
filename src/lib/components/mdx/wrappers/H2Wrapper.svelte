<script lang="ts">
	import H2 from '../blueprints/h2.svelte';

	let { id, html }: { id: string; html: string } = $props();
</script>

<H2 {id}>
	{@html html}
</H2>
