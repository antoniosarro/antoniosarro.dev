<script lang="ts">
	import { getHeadings } from '$lib/utils/blog';

	let { html }: { html: string } = $props();

	let contents = $derived(getHeadings(html));
	let activeID = $state('introduction');

	$effect(() => {
		const handleScroll = () => {
			if (!contents) return;

			const headingIDs = ['introduction', ...contents.map((c) => c.id)];
			const headings = headingIDs
				.map((id) => document.getElementById(id))
				.filter((el): el is HTMLElement => el !== null);

			// Find the first visible heading
			const visibleHeading = headings.find((el) => {
				const rect = el.getBoundingClientRect();
				return rect.top >= 0 && rect.top <= window.innerHeight / 2;
			});

			if (visibleHeading) {
				activeID = visibleHeading.id;
			}
		};

		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<h3 class="mb-4 text-xl font-semibold tracking-tight">Table of Contents</h3>
<nav>
	<a href="#introduction" class="link H2" class:active={activeID === 'introduction'}>
		Introduction
	</a>
	{#each contents ?? [] as { text, id, level }}
		<a class="link H{level}" class:active={activeID === id} href="#{id}">{text}</a>
	{/each}
</nav>

<style lang="postcss">
	@reference "../../../app.css";

	.link {
		@apply block opacity-60 transition-all duration-300 hover:opacity-100;

		&.active {
			@apply font-semibold text-primary opacity-100;
		}

		&.H2 {
			@apply mt-3;
		}

		&.H3,
		&.H4,
		&.H5,
		&.H6 {
			@apply mt-1;
		}

		&:first-child {
			@apply mt-0;
		}

		&.H3 {
			@apply ml-5;
		}
	}
</style>
