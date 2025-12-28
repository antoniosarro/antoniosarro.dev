<script lang="ts">
	import { onMount } from 'svelte';

	interface Snowflake {
		id: number;
		left: number;
		delay: number;
		duration: number;
		size: number;
		opacity: number;
	}

	interface Props {
		count?: number;
		speed?: number;
		startDate?: { month: number; day: number };
		endDate?: { month: number; day: number };
	}

	let {
		count = 50,
		speed = 1,
		startDate = { month: 12, day: 21 },
		endDate = { month: 1, day: 7 }
	}: Props = $props();

	let snowflakes = $state<Snowflake[]>([]);
	let isChristmasSeason = $state(false);

	onMount(() => {
		const today = new Date();
		const month = today.getMonth() + 1;
		const day = today.getDate();

		isChristmasSeason =
			(month === startDate.month && day >= startDate.day) ||
			(month === endDate.month && day <= endDate.day) ||
			(month > startDate.month && month < endDate.month);

		if (isChristmasSeason) {
			snowflakes = Array.from(
				{ length: count },
				(_, i): Snowflake => ({
					id: i,
					left: Math.random() * 100,
					delay: Math.random() * 5,
					duration: 5 + Math.random() * 5,
					size: 3 + Math.random() * 5,
					opacity: 0.4 + Math.random() * 0.4
				})
			);
		}
	});
</script>

{#if isChristmasSeason}
	<div class="pointer-events-none fixed inset-0 z-9999 overflow-hidden">
		{#each snowflakes as flake (flake.id)}
			<div
				class="animate-fall absolute -top-2.5 rounded-full bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)]"
				style="
					left: {flake.left}%;
					animation-delay: {flake.delay}s;
					animation-duration: {flake.duration / speed}s;
					width: {flake.size}px;
					height: {flake.size}px;
					opacity: {flake.opacity};
				">
			</div>
		{/each}
	</div>
{/if}
