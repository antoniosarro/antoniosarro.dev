import type { repositoryPayloadSchema } from './schema';
import type { z } from 'zod';

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
