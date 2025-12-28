<script lang="ts">
	import { elasticOut } from 'svelte/easing';
	import { fly, scale } from 'svelte/transition';
	import { toast } from 'svelte-sonner';

	import Bash from '~icons/devicon-plain/bash';
	import Nginx from '~icons/material-icon-theme/nginx';
	import Dockerfile from '~icons/mdi/docker';
	import Nix from '~icons/mdi/nix';
	import Svelte from '~icons/ri/svelte-fill';
	import Copy from '~icons/tabler/copy';
	import CopyCheck from '~icons/tabler/copy-check';
	import Maximize from '~icons/tabler/maximize';
	import X from '~icons/tabler/x';
	import Typescript from '~icons/teenyicons/typescript-outline';

	import type { Component, Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		title = '',
		language = '',
		maxDigits,
		children,
		...restprops
	}: HTMLAttributes<HTMLPreElement> & {
		title?: string;
		language?: string;
		maxDigits?: number;
		children: Snippet;
	} = $props();

	let codeElement: HTMLElement;
	let copyState = $state<'idle' | 'copying' | 'copied'>('idle');
	let isExpanded = $state(false);

	const handleCopy = async () => {
		if (copyState !== 'idle' || !codeElement) return;

		copyState = 'copying';

		try {
			await navigator.clipboard.writeText(codeElement.innerText ?? '');
			copyState = 'copied';
			toast.success('Copied to clipboard!');
		} catch {
			toast.error('Failed to copy');
			copyState = 'idle';
			return;
		}

		setTimeout(() => {
			copyState = 'idle';
		}, 2000);
	};

	const toggleExpanded = () => {
		isExpanded = !isExpanded;
	};

	$effect(() => {
		if (isExpanded) {
			const originalOverflow = document.body.style.overflow;
			document.body.style.overflow = 'hidden';

			return () => {
				document.body.style.overflow = originalOverflow;
			};
		}
	});

	const langIcons: {
		[key: string]: {
			icon: Component;
			text: string;
		};
	} = {
		bash: { icon: Bash, text: 'Bash' },
		ts: { icon: Typescript, text: 'Typescript' },
		typescript: { icon: Typescript, text: 'Typescript' },
		svelte: { icon: Svelte, text: 'Svelte' },
		nix: { icon: Nix, text: 'Nix' },
		dockerfile: { icon: Dockerfile, text: 'Dockerfile' },
		yaml: { icon: Dockerfile, text: 'Docker Compose' },
		yml: { icon: Dockerfile, text: 'Docker Compose' },
		nginx: { icon: Nginx, text: 'Nginx' }
	};
</script>

<div
	class="border-elevation-one mt-5 flex flex-wrap items-center justify-between gap-2 rounded-t-lg border py-1.5 pr-2 pl-4">
	<div class="flex flex-row items-center gap-4">
		<span class="inline-flex items-center gap-1.5">
			<span class="bg-elevation-one size-4 rounded-full"></span>
			<span class="bg-elevation-one size-4 rounded-full"></span>
			<span class="bg-elevation-one size-4 rounded-full"></span>
		</span>
		<span
			class="m-0 flex flex-row-reverse items-center justify-between gap-2.5 text-sm font-medium">
			{#if title}
				<span>{title}</span>
				{@const extension = title.split('.').pop()}
				{@const isDockerCompose = title.includes('docker-compose')}
				{#if isDockerCompose && langIcons['yaml']}
					{@const Icon = langIcons['yaml'].icon}
					<Icon class="rounded-none border-none text-base" />
				{:else if extension && langIcons[extension]}
					{@const Icon = langIcons[extension].icon}
					<Icon class="rounded-none border-none text-base" />
				{/if}
			{:else if language && langIcons[language]}
				{@const Icon = langIcons[language].icon}
				<span>{langIcons[language].text}</span>
				<Icon class="rounded-none border-none text-base" />
			{/if}
		</span>
	</div>
	<div class="flex items-center gap-2">
		<!-- Copy button with animation -->
		<button
			onclick={handleCopy}
			disabled={copyState !== 'idle'}
			class="border-elevation-one hover:bg-primary hover:text-background relative inline-flex h-8 min-w-[80px] items-center justify-center rounded-md border px-2 py-1 text-sm font-bold duration-300 disabled:cursor-default disabled:hover:bg-transparent disabled:hover:text-inherit {copyState ===
			'copied'
				? 'border-green-500 bg-green-500/10'
				: ''}">
			{#if copyState === 'idle'}
				<span
					in:fly={{ y: 10, duration: 200 }}
					out:fly={{ y: -10, duration: 150 }}
					class="flex items-center gap-2">
					<Copy class="size-4" />
					<span>Copy</span>
				</span>
			{:else if copyState === 'copying'}
				<span
					in:scale={{ start: 0.8, duration: 150 }}
					class="flex items-center gap-2">
					<span
						class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent">
					</span>
				</span>
			{:else if copyState === 'copied'}
				<span
					in:scale={{ start: 0.5, duration: 400, easing: elasticOut }}
					class="flex items-center gap-2 text-green-500">
					<CopyCheck class="size-4" />
					<span>Copied!</span>
				</span>
			{/if}
		</button>
		<!-- Expand/Maximize button -->
		<button
			onclick={toggleExpanded}
			class="border-elevation-one hover:bg-primary hover:text-background flex h-8 w-8 items-center justify-center rounded-md border px-2 py-1 text-sm font-bold duration-500"
			aria-label="Expand code view">
			<Maximize />
		</button>
	</div>
</div>

<div
	class="border-elevation-one mb-4 overflow-auto rounded-lg rounded-t-none border border-t-0">
	<pre
		{...restprops}
		class="px-2 py-3 text-sm outline-none"
		bind:this={codeElement}
		tabindex="-1"
		data-language={language}
		data-theme="material-theme"
		data-line-numbers-max-digits={maxDigits}>
{@render children()}
</pre>
</div>

<!-- Expanded view modal -->
{#if isExpanded}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
		role="button"
		tabindex="-1"
		onclick={toggleExpanded}
		onkeydown={(e) => e.key === 'Escape' && toggleExpanded()}
		transition:fly={{ duration: 200 }}>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="bg-background relative flex max-h-[95vh] w-full max-w-6xl flex-col rounded-lg shadow-2xl"
			onclick={(e) => e.stopPropagation()}>
			<!-- Modal header -->
			<div
				class="border-elevation-one flex shrink-0 items-center justify-between gap-2 rounded-t-lg border-b py-2 pr-2 pl-4">
				<div class="flex flex-row items-center gap-4">
					<span class="inline-flex items-center gap-1.5">
						<span class="bg-elevation-one size-4 rounded-full"></span>
						<span class="bg-elevation-one size-4 rounded-full"></span>
						<span class="bg-elevation-one size-4 rounded-full"></span>
					</span>
					<span
						class="m-0 flex flex-row-reverse items-center justify-between gap-2.5 text-sm font-medium">
						{#if title}
							<span>{title}</span>
							{@const extension = title.split('.').pop()}
							{#if extension && langIcons[extension]}
								{@const Icon = langIcons[extension].icon}
								<Icon class="rounded-none border-none text-base" />
							{/if}
						{:else if language && langIcons[language]}
							{@const Icon = langIcons[language].icon}
							<span>{langIcons[language].text}</span>
							<Icon class="rounded-none border-none text-base" />
						{/if}
					</span>
				</div>
				<div class="flex items-center gap-2">
					<button
						onclick={handleCopy}
						disabled={copyState !== 'idle'}
						class="border-elevation-one hover:bg-primary hover:text-background relative inline-flex h-8 min-w-[80px] items-center justify-center rounded-md border px-2 py-1 text-sm font-bold duration-300 disabled:cursor-default {copyState ===
						'copied'
							? 'border-green-500 bg-green-500/10'
							: ''}">
						{#if copyState === 'idle'}
							<span class="flex items-center gap-2">
								<Copy class="size-4" />
								<span>Copy</span>
							</span>
						{:else if copyState === 'copying'}
							<span
								class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent">
							</span>
						{:else if copyState === 'copied'}
							<span class="flex items-center gap-2 text-green-500">
								<CopyCheck class="size-4" />
								<span>Copied!</span>
							</span>
						{/if}
					</button>
					<button
						onclick={toggleExpanded}
						class="border-elevation-one hover:bg-primary hover:text-background flex h-8 w-8 items-center justify-center rounded-md border px-2 py-1 text-sm font-bold duration-500"
						aria-label="Close expanded view">
						<X />
					</button>
				</div>
			</div>
			<!-- Modal content -->
			<div class="min-h-0 overflow-auto">
				<pre
					class="code-maximize h-full px-4 py-4 text-base outline-none"
					tabindex="-1"
					data-language={language}
					data-theme="material-theme"
					data-line-numbers-max-digits={maxDigits}>
					{@render children()}
				</pre>
			</div>
		</div>
	</div>
{/if}
