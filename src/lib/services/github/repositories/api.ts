import { env } from '$env/dynamic/private';
import type { RepositoryInfo } from '$lib/types/github/types';
import { isRepositoryPayload } from '$lib/types/github/validator';

async function fetchWithRetry(
	url: string,
	options: RequestInit,
	maxRetries = 3,
	baseDelay = 1000
): Promise<Response> {
	let lastError: Error;

	for (let attempt = 0; attempt < maxRetries; attempt++) {
		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 30000);

			const response = await fetch(url, {
				...options,
				signal: controller.signal
			});

			clearTimeout(timeoutId);
			return response;
		} catch (error) {
			lastError = error as Error;

			if (attempt < maxRetries - 1) {
				const delay = baseDelay * Math.pow(2, attempt);
				console.log(`Retry attempt ${attempt + 1} for ${url} after ${delay}ms`);
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		}
	}

	throw lastError!;
}

export async function fetchRepository(name: string): Promise<RepositoryInfo | undefined> {
	try {
		const response = await fetchWithRetry(`https://api.github.com/repos/antoniosarro/${name}`, {
			headers: {
				Authorization: `Bearer ${env.GITHUB_API_TOKEN}`,
				Accept: 'application/vnd.github+json',
				'X-Github-Api-Version': '2022-11-28'
			}
		});

		if (!response.ok) {
			console.error(`Failed to fetch ${name} repository. Status: ${response.status}`);
			return undefined;
		}

		const repositoryData = await response.json();

		if (!isRepositoryPayload(repositoryData)) {
			return undefined;
		}

		const sourceRepo = repositoryData.parent || repositoryData;

		return {
			owner: sourceRepo.owner.login,
			ownerPic: sourceRepo.owner.avatar_url,
			name: repositoryData.name,
			description: repositoryData.description,
			href: sourceRepo.html_url,
			language: sourceRepo.language,
			stars: sourceRepo.stargazers_count,
			forks: sourceRepo.forks_count,
			lastUpdate: sourceRepo.updated_at,
			contributor: !!repositoryData.parent
		};
	} catch (error) {
		console.error(`Error fetching repository ${name}:`, error);
		return undefined;
	}
}
