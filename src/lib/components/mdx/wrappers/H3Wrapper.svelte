<script lang="ts">
	import H3 from '../blueprints/h3.svelte';

	let { id, html }: { id: string; html: string } = $props();
</script>

<H3 {id}>
	{@html html}
</H3>
