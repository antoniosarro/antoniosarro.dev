<script lang="ts">
	import Ol from '../blueprints/ol.svelte';

	let { html }: { html: string } = $props();
</script>

<Ol>
	{@html html}
</Ol>
