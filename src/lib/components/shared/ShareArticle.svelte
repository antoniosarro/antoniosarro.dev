<script lang="ts">
	import X from '~icons/ri/twitter-x-fill';
	import Linkedin from '~icons/mdi/linkedin';
	import Facebook from '~icons/mdi/facebook';
	import WhatsApp from '~icons/mdi/whatsapp';

	interface Props {
		title: string;
		slug: string;
		description: string;
	}

	let { title, slug, description }: Props = $props();

	const blog = encodeURIComponent('https://antoniosarro.dev/blog');
	const options = [
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
	];

	function openPopup(url: string) {
		window.open(
			url,
			'Social Share',
			'width=600,height=600,resizable=yes,scrollbars=yes,status=yes'
		);
	}
</script>

<section class="border-b border-elevation-one pb-10">
	<h3 class="mb-4 text-xl font-semibold tracking-tight">Share Post</h3>
	<div class="flex flex-wrap items-center gap-2 tracking-tight">
		{#each options as { icon, name, shareUrl }}
			{@const Icon = icon}
			<button
				data-umami-event="share|{slug.substring(0, 20)}|{name}"
				title={`Share to ${name}`}
				aria-label={`Share to ${name}`}
				onclick={() => openPopup(shareUrl)}
				class="grid h-12 w-12 place-content-center rounded-md border border-elevation-one p-2 text-2xl duration-300 hover:scale-105 hover:border-primary"
			>
				<Icon />
			</button>
		{/each}
	</div>
</section>
