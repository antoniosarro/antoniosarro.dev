<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { toast } from 'svelte-sonner';

	let { children, ...restprops }: HTMLAttributes<HTMLHeadingElement> & { children: Snippet } =
		$props();
</script>

<h3
	{...restprops}
	class="group relative mt-8 mb-4 block font-incognito text-2xl font-bold tracking-tight text-primary before:absolute before:top-1/2 before:-left-4 before:hidden before:-translate-y-1/2 before:text-xl before:text-primary before:opacity-60 before:content-['#'] hover:before:hidden hover:before:sm:inline-block"
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
</h3>
