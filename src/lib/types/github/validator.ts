import { repositoryPayloadSchema } from './schema';

import type { RepositoryPayloadSchema } from './types';

export function isRepositoryPayload(
	maybeRepositoryPayload: unknown
): maybeRepositoryPayload is RepositoryPayloadSchema {
	const res = repositoryPayloadSchema.safeParse(maybeRepositoryPayload);
	return res.success;
}
