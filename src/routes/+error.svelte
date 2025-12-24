<script lang="ts">
	import Block from '~icons/material-symbols/block';
	import Build from '~icons/material-symbols/build';
	import Error from '~icons/material-symbols/error';
	import SearchOff from '~icons/material-symbols/search-off';
	import Warning from '~icons/material-symbols/warning';

	import { page } from '$app/state';

	import { Metadata } from '$lib/components/shared';

	import type { Component } from 'svelte';

	interface ErrorConfig {
		title: string;
		message: string;
		icon: Component<{ height?: number; width?: number; class?: string }>;
		suggestion: string;
	}

	const errorConfigs: Record<number, ErrorConfig> = {
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

	const defaultError: ErrorConfig = {
		title: 'Something Went Wrong',
		message: 'An unexpected error occurred.',
		icon: Warning,
		suggestion:
			'Please try refreshing the page or contact support if the problem persists.'
	};

	const errorConfig = errorConfigs[page.status] || defaultError;
	const Icon = errorConfig.icon;
</script>

<Metadata />

<main
	class="relative mx-auto flex max-w-7xl flex-col items-center justify-center px-6 md:px-16">
	<div class="mb-8 text-center">
		<div class="mb-6 flex justify-center">
			<Icon height={120} width={120} class="text-primary opacity-80" />
		</div>

		<!-- Error Title -->
		<h1
			class="font-incognito mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
			{errorConfig.title}
		</h1>

		<!-- Error Message -->
		<p class="text-accent mb-2 max-w-2xl text-base leading-relaxed">
			{errorConfig.message}
		</p>

		<!-- Suggestion -->
		<p class="text-accent mb-8 max-w-2xl text-sm">
			{errorConfig.suggestion}
		</p>
	</div>
</main>
