import type { RepositoryInfo } from '$types/github/types';

type RepositoryCache = {
	[key: string]: {
		repository: RepositoryInfo;
		expiresIn: number;
	};
};

class GithubRepositoryCache {
	private cache: RepositoryCache = {};

	updateCacheItem(repo: RepositoryInfo) {
		this.cache[repo.name] = {
			repository: { ...repo },
			expiresIn: Date.now() + 60 * 60 * 1000
		};
	}

	getCacheItem(name: string) {
		if (this.cache[name]) {
			return this.cache[name];
		}
	}

	isCacheItemExpired(name: string) {
		if (this.cache[name]) {
			return this.cache[name].expiresIn < Date.now();
		}
		return true;
	}
}

export const githubRepositoryCache = new GithubRepositoryCache();
