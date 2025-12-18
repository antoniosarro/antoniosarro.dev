<script lang="ts">
	import { socials } from '$lib/data/socials';
</script>

<ul class="my-8 flex flex-wrap items-center gap-x-5 gap-y-4">
	{#each socials as { icon, name, url } (name)}
		{@const Icon = icon}
		<li>
			{#if url}
				<a
					class="group flex items-center gap-1 border-b border-elevation-one"
					aria-label="{name} Link"
					rel="noopener"
					target="_blank"
					href="{url}{!url.includes('mailto') ? '?ref=antoniosarro.dev' : ''}"
				>
					<Icon
						class="flex-shrink-0 duration-300 group-hover:text-primary"
						width={20}
						height={20}
					/>
					{name}
				</a>
			{/if}
		</li>
	{/each}
</ul>
