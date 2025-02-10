<script context="module" lang="ts">
	import { status } from '$lib/stores/umami.svelte';
	status.set(undefined);
	declare let window: WindowWithUmami;
</script>

<script lang="ts">
	import { BROWSER } from 'esm-env';
	import { onDestroy, onMount } from 'svelte';

	import { dev } from '$app/environment';
	import type { WindowWithUmami } from '$types/umami';

	export let websiteID: string;
	export let srcURL: string;

	onMount(() => {
		if (
			BROWSER &&
			document.getElementById('umami_analytics_script') !== null &&
			$status !== 'loaded'
		) {
			$status = 'mounted';
		}
	});

	onDestroy(() => {
		if (BROWSER) {
			const script = document.getElementById('umami_analytics_script');
			if (script !== null) {
				script.remove();
				$status = 'removed';
				window.umami = undefined;
			}
		}
	});

	let shouldInitialize = [undefined, 'removed', 'error'].includes($status);

	function scriptLoaded() {
		$status = 'loaded';
	}

	function errorHappened() {
		$status = 'error';
	}
</script>

<svelte:head>
	{#if shouldInitialize && !dev}
		<script
			async
			defer
			id="umami_analytics_script"
			data-testid="umami_analytics_script"
			src={srcURL}
			data-website-id={websiteID}
			on:load={scriptLoaded}
			on:error={errorHappened}
		></script>
	{/if}
</svelte:head>
