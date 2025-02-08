import { env } from '$env/dynamic/private';
import type { RepositoryInfo } from '$types/github/types';
import { isRepositoryPayload } from '$types/github/validator';

import { githubRepositoryCache } from './cache';

export async function fetchRepository(name: string): Promise<RepositoryInfo | undefined> {
	if (githubRepositoryCache.isCacheItemExpired(name)) {
		try {
			const response = await fetch(getUserRepositoryEndpoint(name, 'antoniosarro'), {
				headers: {
					Authorization: `Bearer ${env.GITHUB_API_TOKEN}`,
					Accept: 'application/vnd.github+json',
					'X-Github-Api-Version': '2022-11-28'
				}
			});

			if (!response.ok) {
				throw new Error(`Failed to fetch ${name} repository. Status: ${response.status}`);
			}

			const repositoryData = await response.json();

			if (isRepositoryPayload(repositoryData)) {
				const cacheItem = {
					owner: repositoryData.parent
						? repositoryData.parent.owner.login
						: repositoryData.owner.login,
					ownerPic: repositoryData.parent
						? repositoryData.parent.owner.avatar_url
						: repositoryData.owner.avatar_url,
					name: repositoryData.name,
					description: repositoryData.description,
					href: repositoryData.parent ? repositoryData.parent.html_url : repositoryData.html_url,
					language: repositoryData.parent
						? repositoryData.parent.language
						: repositoryData.language,
					stars: repositoryData.parent
						? repositoryData.parent.stargazers_count
						: repositoryData.stargazers_count,
					forks: repositoryData.parent
						? repositoryData.parent.forks_count
						: repositoryData.forks_count,
					lastUpdate: repositoryData.parent
						? repositoryData.parent.updated_at
						: repositoryData.updated_at,
					contributor: !!repositoryData.parent
				};

				githubRepositoryCache.updateCacheItem(cacheItem);
			}
		} catch (error) {
			console.error(`Error fetching repository ${name}:`, error);
		}
	}

	return githubRepositoryCache.getCacheItem(name)?.repository;
}

function getUserRepositoryEndpoint(repo: string, user: string): string {
	return `https://api.github.com/repos/${user}/${repo}`;
}
