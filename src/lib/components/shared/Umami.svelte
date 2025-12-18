<script module lang="ts">
	declare let window: WindowWithUmami;
</script>

<script lang="ts">
	import { dev } from '$app/environment';
	import { status } from '$lib/stores/umami.svelte';
	import type { WindowWithUmami } from '$lib/types/umami';
	import type { Attachment } from 'svelte/attachments';
	import { BROWSER } from 'esm-env';

	interface Props {
		websiteID: string;
		srcURL: string;
	}

	let { websiteID, srcURL }: Props = $props();

	const SCRIPT_ID = 'umami_analytics_script';
	const INITIALIZABLE_STATES = [undefined, 'removed', 'error', 'mounted', 'loaded'] as const;

	const shouldInitialize = $derived(!dev && INITIALIZABLE_STATES.includes(status.current));

	function handleScriptLoad() {
		status.set('loaded');
	}

	function handleScriptError() {
		status.set('error');
	}

	const scriptLifecycle: Attachment = () => {
		if (!BROWSER) return;

		status.set('mounted');

		return () => {
			status.set('removed');
			if (window.umami) {
				window.umami = undefined;
			}
		};
	};
</script>

<svelte:head>
	{#if shouldInitialize}
		<script
			async
			defer
			id={SCRIPT_ID}
			data-testid={SCRIPT_ID}
			src={srcURL}
			data-website-id={websiteID}
			onload={handleScriptLoad}
			onerror={handleScriptError}
			{@attach scriptLifecycle}
		></script>
	{/if}
</svelte:head>
