<script lang="ts">
	import Close from '~icons/radix-icons/cross-2';
	import Search from '~icons/solar/magnifer-linear';
	import Loader from '~icons/svg-spinners/ring-resize';

	import { getBlogFilterState } from '$lib/stores/blog.svelte';
	import { debounce } from '$lib/utils/debounce';

	const blogState = getBlogFilterState();

	let inputElement: HTMLInputElement;
	let localValue = $state(blogState.search);
	let isSearching = $state(false);

	// Debounced update to the actual filter state
	const debouncedSearch = debounce((value: string) => {
		blogState.search = value;
		isSearching = false;
	}, 300);

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		localValue = target.value;
		isSearching = true;
		debouncedSearch(target.value);
	}

	function handleClear() {
		localValue = '';
		blogState.clearSearch();
		isSearching = false;
		inputElement?.focus();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			handleClear();
		}
	}

	// Sync local value when state changes externally (e.g., "Clear all filters")
	$effect(() => {
		if (blogState.search !== localValue && !isSearching) {
			localValue = blogState.search;
		}
	});
</script>

<div class="relative w-full">
	<div
		class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
		{#if isSearching}
			<Loader class="text-primary size-5" />
		{:else}
			<Search class="text-accent size-5" />
		{/if}
	</div>
	<input
		bind:this={inputElement}
		value={localValue}
		oninput={handleInput}
		onkeydown={handleKeydown}
		type="text"
		placeholder="Search articles by title, description, or tags..."
		class="border-elevation-one bg-background text-foreground placeholder:text-accent/60 focus:border-primary focus:ring-primary w-full rounded-lg border py-3 pr-10 pl-10 focus:ring-1 focus:outline-none" />
	{#if localValue.length > 0}
		<button
			onclick={handleClear}
			class="text-accent hover:text-primary absolute inset-y-0 right-0 flex items-center pr-3 duration-200"
			aria-label="Clear search">
			<Close class="size-5" />
		</button>
	{/if}
</div>
