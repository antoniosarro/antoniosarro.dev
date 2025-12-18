export type ChangeType = 'added' | 'changed' | 'removed' | 'moved' | 'fixed' | 'security';

export interface ChangeItem {
	type: ChangeType;
	description: string;
	component?: string;
	commitHash?: string;
}

export interface ChangelogEntry {
	version: string;
	date: string;
	commitHash?: string;
	title?: string;
	description?: string;
	changes: ChangeItem[];
}

export interface Changelog {
	entries: ChangelogEntry[];
}
