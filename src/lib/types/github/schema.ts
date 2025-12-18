import { z } from 'zod';

export const repositoryPayloadSchema = z.object({
	name: z.string(),
	owner: z.object({
		login: z.string(),
		avatar_url: z.string()
	}),
	html_url: z.string(),
	description: z
		.string()
		.nullish()
		.transform((s) => s ?? ''),
	fork: z.boolean(),
	updated_at: z.string(),
	stargazers_count: z.number(),
	language: z
		.string()
		.nullish()
		.transform((s) => s ?? ''),
	forks_count: z.number(),
	parent: z
		.object({
			owner: z.object({
				login: z.string(),
				avatar_url: z.string()
			}),
			html_url: z.string(),
			updated_at: z.string(),
			stargazers_count: z.number(),
			language: z
				.string()
				.nullish()
				.transform((s) => s ?? ''),
			forks_count: z.number()
		})
		.optional()
});
