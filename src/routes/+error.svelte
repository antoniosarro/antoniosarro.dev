<script lang="ts">
	import 'iconify-icon';

	import { page } from '$app/state';
	import { Metadata } from '$components/shared/misc';

	const errorConfigs: Record<
		number,
		{ title: string; message: string; icon: string; suggestion: string }
	> = {
		404: {
			title: 'Page Not Found',
			message: "The page you're looking for doesn't exist or has been moved.",
			icon: 'material-symbols:search-off',
			suggestion: 'Try checking the URL or return to the homepage.'
		},
		403: {
			title: 'Access Forbidden',
			message: "You don't have permission to access this resource.",
			icon: 'material-symbols:block',
			suggestion: 'Please contact support if you believe this is an error.'
		},
		500: {
			title: 'Internal Server Error',
			message: 'Something went wrong on our end. Please try again later.',
			icon: 'material-symbols:error',
			suggestion: 'If the problem persists, please contact support.'
		},
		503: {
			title: 'Service Unavailable',
			message: 'The service is temporarily unavailable due to maintenance.',
			icon: 'material-symbols:build',
			suggestion: 'Please try again in a few minutes.'
		}
	};

	const defaultError = {
		title: 'Something Went Wrong',
		message: 'An unexpected error occurred.',
		icon: 'material-symbols:warning',
		suggestion: 'Please try refreshing the page or contact support if the problem persists.'
	};

	const errorConfig = errorConfigs[page.status] || defaultError;
</script>

<Metadata />

<main
	class="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 md:px-16"
>
	<div class="mb-8 text-center">
		<div class="mb-6 flex justify-center">
			<iconify-icon
				noobserver
				height="120"
				width="120"
				class="text-primary opacity-80"
				icon={errorConfig.icon}
			></iconify-icon>
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
