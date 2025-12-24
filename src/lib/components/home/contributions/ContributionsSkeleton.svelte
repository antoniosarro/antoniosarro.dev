<script>
	import CalendarSkeleton from './CalendarSkeleton.svelte';
</script>

<div class="group flex flex-col gap-4 xl:flex-row">
	<div
		class="border-elevation-one max-h-fit max-w-fit rounded-lg border p-4 md:p-6 lg:p-8">
		<CalendarSkeleton />
	</div>
	<div
		class="flex animate-pulse flex-row flex-wrap justify-start gap-2 xl:flex-col">
		<div
			class="border-elevation-one bg-elevation-one h-9 w-16 rounded-lg border px-4 py-2">
		</div>
		<div
			class="border-elevation-one bg-elevation-one h-9 w-16 rounded-lg border px-4 py-2">
		</div>
	</div>
</div>
