<script lang="ts">
	import { giscusStatus } from '$lib/stores/giscus.svelte';
	import { darkMode } from '$lib/stores/theme.svelte';

	import type {
		AvailableLanguage,
		BooleanString,
		InputPosition,
		Loading,
		Mapping,
		Repo,
		Theme
	} from '$lib/types/giscus';
	import type { Attachment } from 'svelte/attachments';

	import { BROWSER } from 'esm-env';

	interface Props {
		id?: string;
		host?: string;
		repo: Repo;
		repoId: string;
		category?: string;
		categoryId?: string;
		mapping?: Mapping;
		term?: string;
		strict?: BooleanString;
		reactionsEnabled?: BooleanString;
		emitMetadata?: BooleanString;
		inputPosition?: InputPosition;
		lang?: AvailableLanguage;
		loading?: Loading;
	}

	let {
		id = 'giscus-comments',
		host = 'https://giscus.app',
		repo,
		repoId,
		category = '',
		categoryId = '',
		mapping = 'pathname',
		term = '',
		strict = '0',
		reactionsEnabled = '1',
		emitMetadata = '0',
		inputPosition = 'bottom',
		lang = 'en',
		loading = 'lazy'
	}: Props = $props();

	let mounted = $state(false);

	const theme = $derived<Theme>(darkMode.value ? 'transparent_dark' : 'light');

	const INITIALIZABLE_STATES = [
		undefined,
		'removed',
		'error',
		'mounted',
		'loaded'
	] as const;

	const shouldInitialize = $derived(
		BROWSER && INITIALIZABLE_STATES.includes(giscusStatus.current)
	);

	// Update theme when it changes
	$effect(() => {
		if (!BROWSER || !mounted) return;

		const iframe = document.querySelector<HTMLIFrameElement>(
			'iframe.giscus-frame'
		);
		if (iframe?.contentWindow) {
			iframe.contentWindow.postMessage(
				{ giscus: { setConfig: { theme } } },
				'https://giscus.app'
			);
		}
	});

	// Load giscus web component
	$effect(() => {
		if (!BROWSER || !shouldInitialize) return;

		import('giscus')
			.then(() => {
				mounted = true;
				giscusStatus.set('loaded');
			})
			.catch(() => {
				giscusStatus.set('error');
			});
	});

	const widgetLifecycle: Attachment = () => {
		if (!BROWSER) return;

		giscusStatus.set('mounted');

		return () => {
			giscusStatus.set('removed');
			mounted = false;
		};
	};
</script>

{#if mounted && shouldInitialize}
	<div class="giscus-container" {@attach widgetLifecycle}>
		<giscus-widget
			{id}
			{host}
			{repo}
			repoid={repoId}
			{category}
			categoryid={categoryId}
			{mapping}
			{term}
			{strict}
			reactionsenabled={reactionsEnabled}
			emitmetadata={emitMetadata}
			inputposition={inputPosition}
			{theme}
			{lang}
			{loading}>
		</giscus-widget>
	</div>
{/if}

<style>
	.giscus-container {
		width: 100%;
	}

	.giscus-container :global(.giscus) {
		width: 100%;
	}

	.giscus-container :global(.giscus-frame) {
		width: 100%;
		border: none;
	}
</style>
