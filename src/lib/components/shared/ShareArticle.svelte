<script lang="ts">
	import Facebook from '~icons/mdi/facebook';
	import Linkedin from '~icons/mdi/linkedin';
	import WhatsApp from '~icons/mdi/whatsapp';
	import X from '~icons/ri/twitter-x-fill';

	interface Props {
		title: string;
		slug: string;
		description: string;
	}

	let { title, slug, description }: Props = $props();

	const blog = encodeURIComponent('https://antoniosarro.dev/blog');
	const options = $derived([
		{
			icon: X,
			name: 'Twitter',
			shareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
				'Thank you @antoniosarro for writing this post.'
			)}.%0A%0A${title}%0A%0A${blog}/${slug}`
		},
		{
			icon: Linkedin,
			name: 'LinkedIn',
			shareUrl: `https://linkedin.com/sharing/share-offsite/?url=${blog}$/{slug}&title=${title}&summary=${description}`
		},
		{
			icon: Facebook,
			name: 'Facebook',
			shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${blog}/${slug}`
		},
		{
			icon: WhatsApp,
			name: 'WhatsApp',
			shareUrl: `https://api.whatsapp.com/send?text=${encodeURIComponent(
				'Read this amazing article by Antonio Sarro'
			)}.%0A%0A${title}%0A%0A${blog}/${slug}`
		}
	]);

	function openPopup(url: string) {
		window.open(
			url,
			'Social Share',
			'width=600,height=600,resizable=yes,scrollbars=yes,status=yes'
		);
	}
</script>

<section class="border-elevation-one border-b pb-10">
	<h3 class="mb-4 text-xl font-semibold tracking-tight">Share Post</h3>
	<div class="flex flex-wrap items-center gap-2 tracking-tight">
		{#each options as { icon, name, shareUrl }, i (i)}
			{@const Icon = icon}
			<button
				data-umami-event="share|{slug.substring(0, 20)}|{name}"
				title={`Share to ${name}`}
				aria-label={`Share to ${name}`}
				onclick={() => openPopup(shareUrl)}
				class="border-elevation-one hover:border-primary grid h-12 w-12 place-content-center rounded-md border p-2 text-2xl duration-300 hover:scale-105">
				<Icon />
			</button>
		{/each}
	</div>
</section>
