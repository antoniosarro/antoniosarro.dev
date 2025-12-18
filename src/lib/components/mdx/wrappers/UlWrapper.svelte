<script lang="ts">
	import Ul from '../blueprints/ul.svelte';

	let { html }: { html: string } = $props();
</script>

<Ul>
	{@html html}
</Ul>
