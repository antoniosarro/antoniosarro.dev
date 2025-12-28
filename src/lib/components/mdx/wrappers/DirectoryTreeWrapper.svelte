<script lang="ts">
	import DirectoryTree from '../DirectoryTree.svelte';

	let { structure, title }: { structure: string; title?: string } = $props();
</script>

<DirectoryTree {structure} {title} />
