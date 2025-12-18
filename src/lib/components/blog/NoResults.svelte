<script lang="ts">
	import SearchOff from '~icons/solar/magnifer-zoom-out-linear';

	interface Props {
		onClear: () => void;
	}

	let { onClear }: Props = $props();
</script>

<div
	class="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-elevation-one py-16 text-center"
>
	<SearchOff class="size-16 text-accent/40" />
	<div class="flex flex-col gap-1">
		<h3 class="font-incognito text-xl font-semibold text-foreground">No articles found</h3>
		<p class="text-accent">Try adjusting your search or filter criteria</p>
	</div>
	<button
		onclick={onClear}
		class="rounded-lg border border-primary bg-primary/10 px-4 py-2 text-sm font-medium text-primary duration-200 hover:bg-primary hover:text-background"
	>
		Clear all filters
	</button>
</div>
