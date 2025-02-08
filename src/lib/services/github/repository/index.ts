import { projects } from '$data/projects';
import type { RepositoryInfo } from '$types/github/types';

import { fetchRepository } from './api';

export async function getGithubProjects() {
	const results: Promise<RepositoryInfo | undefined>[] = projects.map((project) =>
		fetchRepository(project)
	);
	const resolvedResults: (RepositoryInfo | undefined)[] = await Promise.all(results);

	const repos = resolvedResults.filter((info) => info !== null) as RepositoryInfo[];
	repos.sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime());
	return repos;
}
