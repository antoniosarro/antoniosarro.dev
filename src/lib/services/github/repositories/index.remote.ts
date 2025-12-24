import { prerender } from '$app/server';

import { projects } from '$lib/data/projects';

import { fetchRepository } from './api';

import type { RepositoryInfo } from '$lib/types/github/types';

export const getGithubProjects = prerender(async () => {
	const repos = (
		await Promise.all(
			projects.map((project) =>
				fetchRepository(typeof project === 'string' ? project : project.name)
			)
		)
	).filter((repo): repo is RepositoryInfo => repo !== undefined);

	// Add hasArticle information
	repos.forEach((repo) => {
		const projectConfig = projects.find(
			(p) => (typeof p === 'string' ? p : p.name) === repo.name
		);
		repo.hasArticle =
			typeof projectConfig === 'object' ? projectConfig.hasArticle : false;
	});

	return repos.sort(
		(a, b) =>
			new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime()
	);
});
