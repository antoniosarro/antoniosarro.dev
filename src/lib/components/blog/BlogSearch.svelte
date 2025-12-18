<script lang="ts">
	import Search from '~icons/solar/magnifer-linear';
	import Close from '~icons/radix-icons/cross-2';
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
	<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
		{#if isSearching}
			<Loader class="size-5 text-primary" />
		{:else}
			<Search class="size-5 text-accent" />
		{/if}
	</div>
	<input
		bind:this={inputElement}
		value={localValue}
		oninput={handleInput}
		onkeydown={handleKeydown}
		type="text"
		placeholder="Search articles by title, description, or tags..."
		class="w-full rounded-lg border border-elevation-one bg-background py-3 pr-10 pl-10 text-foreground placeholder:text-accent/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
	/>
	{#if localValue.length > 0}
		<button
			onclick={handleClear}
			class="absolute inset-y-0 right-0 flex items-center pr-3 text-accent duration-200 hover:text-primary"
			aria-label="Clear search"
		>
			<Close class="size-5" />
		</button>
	{/if}
</div>
