<script lang="ts">
	import SearchOff from '~icons/material-symbols/search-off';
	import Block from '~icons/material-symbols/block';
	import Error from '~icons/material-symbols/error';
	import Build from '~icons/material-symbols/build';
	import Warning from '~icons/material-symbols/warning';

	import { page } from '$app/state';
	import { Metadata } from '$lib/components/shared';

	const errorConfigs: Record<
		number,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		{ title: string; message: string; icon: any; suggestion: string }
	> = {
		404: {
			title: 'Page Not Found',
			message: "The page you're looking for doesn't exist or has been moved.",
			icon: SearchOff,
			suggestion: 'Try checking the URL or return to the homepage.'
		},
		403: {
			title: 'Access Forbidden',
			message: "You don't have permission to access this resource.",
			icon: Block,
			suggestion: 'Please contact support if you believe this is an error.'
		},
		500: {
			title: 'Internal Server Error',
			message: 'Something went wrong on our end. Please try again later.',
			icon: Error,
			suggestion: 'If the problem persists, please contact support.'
		},
		503: {
			title: 'Service Unavailable',
			message: 'The service is temporarily unavailable due to maintenance.',
			icon: Build,
			suggestion: 'Please try again in a few minutes.'
		}
	};

	const defaultError = {
		title: 'Something Went Wrong',
		message: 'An unexpected error occurred.',
		icon: Warning,
		suggestion: 'Please try refreshing the page or contact support if the problem persists.'
	};

	const errorConfig = errorConfigs[page.status] || defaultError;
	const Icon = errorConfig.icon;
</script>

<Metadata />

<main
	class="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 md:px-16"
>
	<div class="mb-8 text-center">
		<div class="mb-6 flex justify-center">
			<Icon height={120} width={120} class="text-primary opacity-80" />
		</div>

		<!-- Status Code -->
		<div class="mb-4 font-incognito text-2xl font-bold tracking-tight text-primary sm:text-3xl">
			{page.status}
		</div>

		<!-- Error Title -->
		<h1 class="mb-4 font-incognito text-3xl font-semibold tracking-tight sm:text-4xl">
			{errorConfig.title}
		</h1>

		<!-- Error Message -->
		<p class="mb-2 max-w-2xl text-base leading-relaxed text-accent">
			{errorConfig.message}
		</p>

		<!-- Error Detail (if available) -->
		{#if page.error?.message && page.error.message !== errorConfig.title}
			<p class="mb-4 max-w-2xl text-sm text-accent opacity-80">
				{page.error.message}
			</p>
		{/if}

		<!-- Suggestion -->
		<p class="mb-8 max-w-2xl text-sm text-accent">
			{errorConfig.suggestion}
		</p>
	</div>
</main>
