<script context="module" lang="ts">
	import { status } from '$lib/stores/umami.svelte';
	status.set(undefined);
	declare let window: WindowWithUmami;
</script>

<script lang="ts">
	import { BROWSER } from 'esm-env';
	import { onDestroy, onMount } from 'svelte';

	import { dev } from '$app/environment';
	import type { UmamiTrackerConfiguration, WindowWithUmami } from '$types/umami';

	/** The unique ID of the website */
	export let websiteID: string;
	/** The URL of the Umami Analytics script */
	export let srcURL: string;
	/** Configuration options for the Umami Analytics script */
	export let configuration: UmamiTrackerConfiguration = {};

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

	// It triggers after the script was loaded and executed
	function scriptLoaded() {
		$status = 'loaded';
	}

	// Errors that occur during the loading of the script
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
			{...configuration}
			on:load={scriptLoaded}
			on:error={errorHappened}
		></script>
	{/if}
</svelte:head>
