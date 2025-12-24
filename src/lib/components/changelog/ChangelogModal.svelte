<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

	import Github from '~icons/mdi/github';
	import Plus from '~icons/solar/add-circle-bold';
	import Bug from '~icons/solar/bug-bold';
	import Calendar from '~icons/solar/calendar-bold';
	import GitCommit from '~icons/solar/code-square-linear';
	import Edit from '~icons/solar/pen-bold';
	import Shield from '~icons/solar/shield-check-bold';
	import Tag from '~icons/solar/tag-bold';
	import Move from '~icons/solar/transfer-horizontal-bold';
	import Trash from '~icons/solar/trash-bin-trash-bold';

	import { getCommitUrl } from '$lib/services/changelog';
	import { formatDateFull } from '$lib/utils/date';

	import type { ChangelogEntry, ChangeType } from '$lib/types/changelog';

	interface Props {
		entry: ChangelogEntry | null;
		onclose: () => void;
	}

	let { entry, onclose }: Props = $props();

	const isOpen = $derived(entry !== null);

	const githubUrl = $derived(
		entry?.commitHash
			? `https://github.com/antoniosarro/antoniosarro.dev/commit/${entry.commitHash}`
			: null
	);

	const typeConfig: Record<
		ChangeType,
		{
			icon: typeof Plus;
			label: string;
			color: string;
			bgColor: string;
			borderColor: string;
		}
	> = {
		added: {
			icon: Plus,
			label: 'Added',
			color: 'text-green-500',
			bgColor: 'bg-green-500/10',
			borderColor: 'border-green-500/30'
		},
		changed: {
			icon: Edit,
			label: 'Changed',
			color: 'text-blue-500',
			bgColor: 'bg-blue-500/10',
			borderColor: 'border-blue-500/30'
		},
		removed: {
			icon: Trash,
			label: 'Removed',
			color: 'text-red-500',
			bgColor: 'bg-red-500/10',
			borderColor: 'border-red-500/30'
		},
		moved: {
			icon: Move,
			label: 'Moved',
			color: 'text-purple-500',
			bgColor: 'bg-purple-500/10',
			borderColor: 'border-purple-500/30'
		},
		fixed: {
			icon: Bug,
			label: 'Fixed',
			color: 'text-orange-500',
			bgColor: 'bg-orange-500/10',
			borderColor: 'border-orange-500/30'
		},
		security: {
			icon: Shield,
			label: 'Security',
			color: 'text-yellow-500',
			bgColor: 'bg-yellow-500/10',
			borderColor: 'border-yellow-500/30'
		}
	};

	const groupedChanges = $derived.by(() => {
		if (!entry) return [];

		const order: ChangeType[] = [
			'added',
			'changed',
			'fixed',
			'security',
			'moved',
			'removed'
		];

		return order
			.map((type) => ({
				type,
				items: entry.changes.filter((change) => change.type === type)
			}))
			.filter((group) => group.items.length > 0);
	});

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isOpen) {
			onclose();
		}
	}

	$effect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen && entry}
	<div
		class="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
		role="dialog"
		aria-modal="true"
		aria-labelledby="changelog-modal-title">
		<button
			class="bg-background/60 absolute inset-0 backdrop-blur-md"
			onclick={onclose}
			aria-label="Close modal"
			transition:fade={{ duration: 200 }}>
		</button>

		<div
			class="border-elevation-one bg-background relative z-10 flex max-h-[95vh] w-full flex-col overflow-hidden rounded-t-2xl border shadow-2xl sm:max-h-[85vh] sm:max-w-2xl sm:rounded-2xl"
			transition:fly={{ y: 100, duration: 300, easing: cubicOut }}>
			<!-- Header -->
			<div
				class="border-elevation-one bg-elevation-one/30 relative shrink-0 border-b p-5 sm:p-6">
				<!-- Version and date row -->
				<div class="mb-4 flex flex-wrap items-center gap-3">
					<span
						class="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold sm:text-sm">
						<Tag class="size-3.5" />
						v{entry.version}
					</span>

					<div class="text-accent flex items-center gap-1.5 text-xs sm:text-sm">
						<Calendar class="size-3.5" />
						<time datetime={entry.date}>{formatDateFull(entry.date)}</time>
					</div>

					{#if githubUrl}
						<a
							href={githubUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="border-elevation-one text-accent hover:border-primary hover:text-primary ml-auto inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs transition-all"
							title="View merge commit on GitHub">
							<Github class="size-3.5" />
							<span>{entry.commitHash?.substring(0, 7)}</span>
						</a>
					{/if}
				</div>

				<!-- Title and description -->
				{#if entry.title}
					<h2
						id="changelog-modal-title"
						class="font-incognito text-foreground text-xl font-bold tracking-tight sm:text-2xl">
						{entry.title}
					</h2>
				{/if}

				{#if entry.description}
					<p class="text-accent mt-2 text-sm leading-relaxed">
						{entry.description}
					</p>
				{/if}
			</div>

			<!-- Changes list -->
			<div class="flex-1 overflow-y-auto p-5 sm:p-6">
				<div class="flex flex-col gap-5">
					{#each groupedChanges as { type, items } (type)}
						{@const config = typeConfig[type]}
						{@const Icon = config.icon}

						<div
							class="rounded-xl border p-4 {config.borderColor} {config.bgColor}">
							<!-- Section header -->
							<div class="mb-4 flex items-center gap-2.5">
								<div
									class="flex size-7 items-center justify-center rounded-lg {config.bgColor} {config.color}">
									<Icon class="size-4" />
								</div>
								<h3 class="text-base font-semibold {config.color}">
									{config.label}
								</h3>
								<span
									class="rounded-full px-2 py-0.5 text-xs font-medium {config.bgColor} {config.color}">
									{items.length}
								</span>
							</div>

							<!-- Items list -->
							<ul class="flex flex-col gap-2.5">
								{#each items as item, idx (idx)}
									<li class="bg-background/50 rounded-lg p-3">
										<div class="flex items-start gap-2.5">
											<span
												class="mt-2 size-1.5 shrink-0 rounded-full {config.color}">
											</span>
											<div class="flex min-w-0 flex-1 flex-col gap-2">
												<div class="flex items-start justify-between gap-3">
													<span class="text-foreground text-sm leading-relaxed">
														{item.description}
													</span>

													{#if item.commitHash}
														<a
															href={getCommitUrl(item.commitHash)}
															target="_blank"
															rel="noopener noreferrer"
															class="border-elevation-one text-accent hover:border-primary hover:text-primary flex shrink-0 items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] transition-all"
															title="View commit {item.commitHash}">
															<GitCommit class="size-3" />
															{item.commitHash}
														</a>
													{/if}
												</div>

												{#if item.components}
													<div class="flex flex-col gap-2">
														{#each item.components as component, i (i)}
															<code
																class="border-elevation-one bg-elevation-one/50 text-accent w-fit max-w-full truncate rounded-md border px-2 py-1 font-mono text-xs">
																{component}
															</code>
														{/each}
													</div>
												{/if}
											</div>
										</div>
									</li>
								{/each}
							</ul>
						</div>
					{/each}
				</div>
			</div>

			<!-- Footer -->
			<div
				class="border-elevation-one bg-elevation-one/30 shrink-0 border-t px-5 py-4 sm:px-6">
				<div class="flex items-center justify-between">
					<span class="text-accent text-sm">
						{entry.changes.length} change{entry.changes.length !== 1 ? 's' : ''}
					</span>
					<button
						onclick={onclose}
						class="border-elevation-one bg-background text-foreground hover:border-primary hover:text-primary rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200">
						Close
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
