<script lang="ts">
	import 'iconify-icon';

	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { fly } from 'svelte/transition';
	import { toast } from 'svelte-sonner';

	let {
		title = '',
		children,
		...restprops
	}: HTMLAttributes<HTMLPreElement> & {
		title?: string;
		children: Snippet;
	} = $props();

	let codeElement: HTMLElement;
	let copyState = $state(false);
	let lang: string = $state('');

	const handleCopy = () => {
		if (codeElement) {
			navigator.clipboard.writeText(codeElement.innerText ?? '');
			toast.success('Copied to clipboard!');
		}
		copyState = true;
		setTimeout(() => {
			copyState = false;
		}, 1500);
	};

	$effect(() => {
		if (codeElement) {
			const languageAttribute = codeElement.getAttribute('data-language');
			lang = languageAttribute as string;
		}
	});

	const langIcons: {
		[key: string]: {
			icon: string;
			text: string;
		};
	} = {
		bash: {
			icon: 'devicon-plain:bash',
			text: 'Bash'
		},
		ts: {
			icon: 'teenyicons:typescript-outline',
			text: 'Typescript'
		},
		svelte: {
			icon: 'ri:svelte-fill',
			text: 'Svelte'
		}
	};
</script>

<div
	class="mt-5 flex flex-wrap items-center justify-between gap-2 rounded-t-lg border border-elevation-one py-1.5 pl-4 pr-2"
>
	<div class="flex flex-row items-center gap-4">
		<span class="inline-flex items-center gap-1.5">
			<span class="size-4 rounded-full bg-elevation-one"></span>
			<span class="size-4 rounded-full bg-elevation-one"></span>
			<span class="size-4 rounded-full bg-elevation-one"></span>
		</span>
		<span
			class="m-0 flex flex-row-reverse items-center justify-between gap-2.5 text-sm font-medium"
		>
			{#if title}
				<span>{title}</span>
				{@const extension = title.split('.').pop()}
				{#if extension && langIcons[extension]}
					<iconify-icon
						class="rounded-none border-none text-base"
						noobserver
						icon={langIcons[extension].icon}
					></iconify-icon>
				{/if}
			{:else if lang && langIcons[lang]}
				{langIcons[lang].text}
				<iconify-icon
					class="rounded-none border-none text-base"
					noobserver
					icon={langIcons[lang].icon}
				></iconify-icon>
			{/if}
		</span>
	</div>
	<div>
		<button
			onclick={handleCopy}
			class="inline-flex rounded-md border border-elevation-one px-2 py-1 text-sm font-bold duration-500 hover:bg-primary hover:text-background"
		>
			{#if copyState}
				<span in:fly={{ x: -4, delay: 50 }} class="flex items-center justify-center gap-1">
					<span>Copied</span>
					<iconify-icon noobserver icon="tabler:copy-check"></iconify-icon>
				</span>
			{:else}
				<span in:fly={{ x: 4, delay: 50 }} class="flex items-center justify-center gap-2">
					<span>Copy</span>
					<iconify-icon noobserver icon="tabler:copy"></iconify-icon>
				</span>
			{/if}
		</button>
	</div>
</div>
<div class="mb-4 overflow-scroll rounded-lg rounded-t-none border border-t-0 border-elevation-one">
	<pre {...restprops} class="px-2 py-3 text-sm outline-none" bind:this={codeElement}>
		{@render children()}
    </pre>
</div>
