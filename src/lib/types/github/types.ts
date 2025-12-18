import { z } from 'zod';

import type { repositoryPayloadSchema } from './schema';

export type RepositoryPayloadSchema = z.infer<typeof repositoryPayloadSchema>;

export interface RepositoryInfo {
	owner: string;
	ownerPic: string;
	name: string;
	description: string;
	href: string;
	language: string;
	stars: number;
	forks: number;
	lastUpdate: string;
	contributor: boolean;
	hasArticle?: boolean;
}
