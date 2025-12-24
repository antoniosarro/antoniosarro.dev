<script lang="ts">
	import SearchOff from '~icons/solar/magnifer-zoom-out-linear';

	interface Props {
		onClear: () => void;
	}

	let { onClear }: Props = $props();
</script>

<div
	class="border-elevation-one flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed py-16 text-center">
	<SearchOff class="text-accent/40 size-16" />
	<div class="flex flex-col gap-1">
		<h3 class="font-incognito text-foreground text-xl font-semibold">
			No articles found
		</h3>
		<p class="text-accent">Try adjusting your search or filter criteria</p>
	</div>
	<button
		onclick={onClear}
		class="border-primary bg-primary/10 text-primary hover:bg-primary hover:text-background rounded-lg border px-4 py-2 text-sm font-medium duration-200">
		Clear all filters
	</button>
</div>
