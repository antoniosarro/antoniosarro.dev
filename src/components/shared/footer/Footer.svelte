<script lang="ts">
	import 'iconify-icon';

	import { footerTechStack } from '$data/techs';
</script>

<footer class="relative min-h-full">
	<div
		class="mx-auto flex max-w-7xl flex-col items-center justify-center gap-y-3 lg:flex-row lg:justify-between"
	>
		<div class="flex flex-col items-center gap-y-3">
			<h3 class="font-inter">
				Made with <span class="font-bold text-primary">pain</span> &
				<span class="font-bold text-primary">love</span> using:
			</h3>
			<ul class="flex items-center gap-x-6 text-sm text-zinc-400 md:mt-0 dark:text-zinc-600">
				{#each footerTechStack as { href, icon, label, name }}
					<li>
						<a
							class="flex items-center gap-x-2 text-primary hover:underline"
							{href}
							rel="noreferrer noopener"
							target="_blank"
							aria-label={label}
						>
							<iconify-icon noobserver height="20" width="20" class="flex" {icon}></iconify-icon>
							{name}
						</a>
					</li>
				{/each}
			</ul>
		</div>
		<div class="flex flex-col items-center text-center lg:items-end lg:text-start">
			<small class="text-text opacity-60">
				Copyright &copy; Antonio Sarro {new Date().getFullYear()} All rights Reserved
			</small>
		</div>
	</div>
</footer>
