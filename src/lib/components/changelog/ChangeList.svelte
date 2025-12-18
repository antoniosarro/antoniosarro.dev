<script lang="ts">
	import Plus from '~icons/solar/add-circle-bold';
	import Edit from '~icons/solar/pen-bold';
	import Trash from '~icons/solar/trash-bin-trash-bold';
	import Move from '~icons/solar/transfer-horizontal-bold';
	import Bug from '~icons/solar/bug-bold';
	import Shield from '~icons/solar/shield-check-bold';

	import type { ChangeItem, ChangeType } from '$lib/types/changelog';

	interface Props {
		changes: ChangeItem[];
	}

	let { changes }: Props = $props();

	const typeConfig: Record<
		ChangeType,
		{ icon: typeof Plus; label: string; color: string; bgColor: string }
	> = {
		added: {
			icon: Plus,
			label: 'Added',
			color: 'text-green-500',
			bgColor: 'bg-green-500/10 border-green-500/20'
		},
		changed: {
			icon: Edit,
			label: 'Changed',
			color: 'text-blue-500',
			bgColor: 'bg-blue-500/10 border-blue-500/20'
		},
		removed: {
			icon: Trash,
			label: 'Removed',
			color: 'text-red-500',
			bgColor: 'bg-red-500/10 border-red-500/20'
		},
		moved: {
			icon: Move,
			label: 'Moved',
			color: 'text-purple-500',
			bgColor: 'bg-purple-500/10 border-purple-500/20'
		},
		fixed: {
			icon: Bug,
			label: 'Fixed',
			color: 'text-orange-500',
			bgColor: 'bg-orange-500/10 border-orange-500/20'
		},
		security: {
			icon: Shield,
			label: 'Security',
			color: 'text-yellow-500',
			bgColor: 'bg-yellow-500/10 border-yellow-500/20'
		}
	};

	// Group changes by type
	const groupedChanges = $derived.by(() => {
		const groups = new Map<ChangeType, ChangeItem[]>();
		const order: ChangeType[] = ['added', 'changed', 'fixed', 'security', 'moved', 'removed'];

		for (const change of changes) {
			const existing = groups.get(change.type) || [];
			groups.set(change.type, [...existing, change]);
		}

		return order
			.filter((type) => groups.has(type))
			.map((type) => ({ type, items: groups.get(type)! }));
	});
</script>

<div class="flex flex-col gap-4">
	{#each groupedChanges as { type, items } (type)}
		{@const config = typeConfig[type]}
		{@const Icon = config.icon}

		<div>
			<div class="mb-2 flex items-center gap-2">
				<span
					class="inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-semibold {config.bgColor} {config.color}"
				>
					<Icon class="size-3" />
					{config.label}
				</span>
				<span class="text-xs text-accent">({items.length})</span>
			</div>

			<ul class="flex flex-col gap-1.5">
				{#each items as item (item.description)}
					<li class="flex items-start gap-2 text-sm text-foreground/80">
						<span class="mt-1.5 size-1.5 shrink-0 rounded-full {config.color} opacity-60"></span>
						<span>
							{item.description}
							{#if item.component}
								<code
									class="ml-1 rounded bg-elevation-one px-1 py-0.5 font-mono text-xs text-accent"
								>
									{item.component}
								</code>
							{/if}
						</span>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</div>
