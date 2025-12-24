<script lang="ts">
	import Github from '~icons/mdi/github';
	import Plus from '~icons/solar/add-circle-bold';
	import ChevronRight from '~icons/solar/alt-arrow-right-linear';
	import Bug from '~icons/solar/bug-bold';
	import Calendar from '~icons/solar/calendar-bold';
	import Edit from '~icons/solar/pen-bold';
	import Tag from '~icons/solar/tag-bold';
	import Trash from '~icons/solar/trash-bin-trash-bold';

	import { formatDateFull } from '$lib/utils/date';

	import type { ChangelogEntry, ChangeType } from '$lib/types/changelog';

	interface Props {
		entry: ChangelogEntry;
		index: number;
		onclick: () => void;
	}

	let { entry, index, onclick }: Props = $props();

	const isEven = $derived(index % 2 === 0);
	const githubUrl = $derived(
		entry.commitHash
			? `https://github.com/antoniosarro/antoniosarro.dev/commit/${entry.commitHash}`
			: null
	);

	// Count changes by type
	const changeCounts = $derived.by(() => {
		const counts: Partial<Record<ChangeType, number>> = {};
		for (const change of entry.changes) {
			counts[change.type] = (counts[change.type] || 0) + 1;
		}
		return counts;
	});

	const typeConfig: Record<
		ChangeType,
		{ icon: typeof Plus; label: string; color: string; bgColor: string }
	> = {
		added: {
			icon: Plus,
			label: 'Added',
			color: 'text-green-500',
			bgColor: 'bg-green-500/10'
		},
		changed: {
			icon: Edit,
			label: 'Changed',
			color: 'text-blue-500',
			bgColor: 'bg-blue-500/10'
		},
		removed: {
			icon: Trash,
			label: 'Removed',
			color: 'text-red-500',
			bgColor: 'bg-red-500/10'
		},
		moved: {
			icon: Edit,
			label: 'Moved',
			color: 'text-purple-500',
			bgColor: 'bg-purple-500/10'
		},
		fixed: {
			icon: Bug,
			label: 'Fixed',
			color: 'text-orange-500',
			bgColor: 'bg-orange-500/10'
		},
		security: {
			icon: Bug,
			label: 'Security',
			color: 'text-yellow-500',
			bgColor: 'bg-yellow-500/10'
		}
	};

	// Display order for change type badges
	const displayOrder: ChangeType[] = [
		'added',
		'changed',
		'fixed',
		'removed',
		'moved',
		'security'
	];
	const visibleTypes = $derived(
		displayOrder.filter((type) => changeCounts[type])
	);
</script>

<!-- Mobile layout: dot on left, card on right -->
<!-- Desktop layout: alternating sides with centered dot -->
<div class="relative w-full">
	<!-- Mobile Layout -->
	<div class="flex items-center gap-4 md:hidden">
		<!-- Dot container - fixed width to align with timeline -->
		<div class="flex w-4 shrink-0 items-center justify-center">
			<div
				class="border-primary bg-background flex size-3 items-center justify-center rounded-full border-2">
				<div class="bg-primary size-1 rounded-full"></div>
			</div>
		</div>

		<!-- Card -->
		<div class="min-w-0 flex-1">
			<button
				{onclick}
				class="group border-elevation-one bg-background hover:border-primary hover:shadow-primary/5 w-full cursor-pointer rounded-xl border p-4 text-left shadow-sm transition-all duration-300 hover:shadow-lg">
				<!-- Header -->
				<div class="mb-3 flex flex-wrap items-center gap-2">
					<span
						class="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold">
						<Tag class="size-3" />
						v{entry.version}
					</span>

					<div class="text-accent flex items-center gap-1.5 text-xs">
						<Calendar class="size-3" />
						<time datetime={entry.date}>{formatDateFull(entry.date)}</time>
					</div>
				</div>

				<!-- Title & Description -->
				{#if entry.title}
					<h3
						class="font-incognito text-foreground group-hover:text-primary mb-2 text-base font-bold tracking-tight transition-colors">
						{entry.title}
					</h3>
				{/if}

				{#if entry.description}
					<p class="text-accent mb-3 line-clamp-2 text-xs leading-relaxed">
						{entry.description}
					</p>
				{/if}

				<!-- Change counts summary -->
				<div class="flex flex-wrap items-center gap-1.5">
					{#each visibleTypes as type (type)}
						{@const config = typeConfig[type]}
						{@const Icon = config.icon}
						{@const count = changeCounts[type]}
						<span
							class="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium {config.bgColor} {config.color}">
							<Icon class="size-2.5" />
							{count}
						</span>
					{/each}
				</div>
			</button>
		</div>
	</div>

	<!-- Desktop Layout -->
	<div
		class="hidden md:flex md:items-center {isEven
			? 'md:flex-row'
			: 'md:flex-row-reverse'}">
		<!-- Card side -->
		<div
			class="w-[calc(50%-2rem)] {isEven
				? 'pr-8 text-right'
				: 'pl-8 text-left'}">
			<button
				{onclick}
				class="group border-elevation-one bg-background hover:border-primary hover:shadow-primary/5 w-full cursor-pointer rounded-xl border p-6 text-left shadow-sm transition-all duration-300 hover:shadow-lg">
				<!-- Header -->
				<div
					class="mb-3 flex flex-wrap items-center gap-3 {isEven
						? 'flex-row-reverse'
						: 'flex-row'}">
					<span
						class="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold">
						<Tag class="size-3.5" />
						v{entry.version}
					</span>

					<div class="text-accent flex items-center gap-2 text-sm">
						<Calendar class="size-3.5" />
						<time datetime={entry.date}>{formatDateFull(entry.date)}</time>
					</div>

					{#if githubUrl}
						<a
							href={githubUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="text-accent hover:text-primary flex items-center gap-1 font-mono text-xs transition-colors"
							title="View commit on GitHub"
							onclick={(e) => e.stopPropagation()}>
							<Github class="size-3.5" />
							{entry.commitHash?.substring(0, 7)}
						</a>
					{/if}
				</div>

				<!-- Title & Description -->
				{#if entry.title}
					<h3
						class="font-incognito text-foreground group-hover:text-primary mb-2 text-xl font-bold tracking-tight transition-colors
							   {isEven ? 'text-right' : 'text-left'}">
						{entry.title}
					</h3>
				{/if}

				{#if entry.description}
					<p
						class="text-accent mb-4 line-clamp-2 text-sm leading-relaxed
							   {isEven ? 'text-right' : 'text-left'}">
						{entry.description}
					</p>
				{/if}

				<!-- Change counts summary -->
				<div
					class="flex flex-wrap items-center gap-2 {isEven
						? 'flex-row-reverse'
						: 'flex-row'}">
					{#each visibleTypes as type (type)}
						{@const config = typeConfig[type]}
						{@const Icon = config.icon}
						{@const count = changeCounts[type]}
						<span
							class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium {config.bgColor} {config.color}">
							<Icon class="size-3" />
							{count}
						</span>
					{/each}

					<!-- View details hint -->
					<span
						class="text-accent flex items-center gap-1 text-xs opacity-0 transition-opacity group-hover:opacity-100
							   {isEven ? 'mr-auto' : 'ml-auto'}">
						View details
						<ChevronRight class="size-3" />
					</span>
				</div>
			</button>
		</div>

		<!-- Center dot -->
		<div class="flex w-16 shrink-0 items-center justify-center">
			<div
				class="border-primary bg-background flex size-4 items-center justify-center rounded-full border-2">
				<div class="bg-primary size-2 rounded-full"></div>
			</div>
		</div>

		<!-- Empty side (spacer) -->
		<div class="w-[calc(50%-2rem)]"></div>
	</div>
</div>
