<script lang="ts">
	import 'iconify-icon';

	import { socials } from '$data/socials';
</script>

<ul class="my-8 flex flex-wrap items-center gap-x-5 gap-y-4">
	{#each socials as { icon, name, url }}
		<li>
			{#if url}
				<a
					class="group flex items-center border-b border-elevation-one"
					aria-label="{name} Link"
					rel="noopener"
					target="_blank"
					href="{url}{!url.includes('mailto') ? '?ref=antoniosarro.dev' : ''}"
				>
					<iconify-icon
						noobserver
						height="20"
						width="20"
						class="flex-shrink-0 duration-300 group-hover:text-primary"
						{icon}
					></iconify-icon>{' '}
					&nbsp;{name}
				</a>
			{/if}
		</li>
	{/each}
</ul>
