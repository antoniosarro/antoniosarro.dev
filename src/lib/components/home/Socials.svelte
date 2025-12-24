<script lang="ts">
	import { socials } from '$lib/data/socials';
</script>

<ul class="my-8 flex flex-wrap items-center gap-x-5 gap-y-4">
	{#each socials as { icon, name, url } (name)}
		{@const Icon = icon}
		<li>
			{#if url}
				<a
					class="group border-elevation-one flex items-center gap-1 border-b"
					aria-label="{name} Link"
					rel="noopener"
					target="_blank"
					href="{url}{!url.includes('mailto') ? '?ref=antoniosarro.dev' : ''}">
					<Icon
						class="group-hover:text-primary shrink-0 duration-300"
						width={20}
						height={20} />
					{name}
				</a>
			{/if}
		</li>
	{/each}
</ul>
