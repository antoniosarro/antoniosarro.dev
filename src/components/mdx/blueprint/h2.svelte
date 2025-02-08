<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { toast } from 'svelte-sonner';

	let { children, ...restprops }: HTMLAttributes<HTMLHeadingElement> & { children: Snippet } =
		$props();
</script>

<h2
	{...restprops}
	class="group relative mb-4 mt-8 block font-incognito text-3xl font-bold tracking-tight text-primary before:absolute before:-left-4 before:top-1/2 before:hidden before:-translate-y-1/2 before:text-xl before:text-primary before:opacity-60 before:content-['#'] hover:before:hidden hover:before:sm:inline-block"
>
	<a
		class="link"
		tabindex={-1}
		href={`#${restprops.id}`}
		onclick={() => {
			navigator.clipboard.writeText(window.location.href);
			toast.success('Link copied!', {
				duration: 1000
			});
		}}
	>
		{@render children()}
	</a>
</h2>
