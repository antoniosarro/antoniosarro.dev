import { Frontmatter } from '../types/blog';

export function isValidBlogFile(
	file: unknown,
	slug: string
): file is { metadata: Omit<Frontmatter, 'slug'> } {
	return !!file && typeof file === 'object' && 'metadata' in file && !!slug;
}
