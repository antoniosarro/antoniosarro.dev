<script lang="ts">
	import 'iconify-icon';
	import { socials } from '$data/socials';
</script>

<ul class="flex flex-wrap items-center gap-x-5 gap-y-4">
	{#each socials as { icon, name, url }}
		<li>
			<a
				class="group flex items-center border-b border-elevation-one"
				aria-label="{name} Link"
				rel="noopener"
				target="_blank"
				href="{url}?ref=antoniosarro.dev"
			>
				<iconify-icon
					height="20"
					width="20"
					class="flex-shrink-0 duration-300 group-hover:text-primary"
					{icon}
				></iconify-icon>{' '}
				&nbsp;{name}
			</a>
		</li>
	{/each}
</ul>
