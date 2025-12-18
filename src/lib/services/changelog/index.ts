import type { Changelog, ChangelogEntry, ChangeItem, ChangeType } from '$lib/types/changelog';

import changelogRaw from '../../../../CHANGELOG.md?raw';

const VALID_TYPES: ChangeType[] = ['added', 'changed', 'removed', 'moved', 'fixed', 'security'];

function isValidChangeType(type: string): type is ChangeType {
	return VALID_TYPES.includes(type as ChangeType);
}

/**
 * Parse the CHANGELOG.md file into structured data
 */
function parseChangelog(markdown: string): Changelog {
	const entries: ChangelogEntry[] = [];

	const entryRegex = /<!--CHANGELOG_ENTRY_START-->([\s\S]*?)<!--CHANGELOG_ENTRY_END-->/g;
	let match;

	while ((match = entryRegex.exec(markdown)) !== null) {
		const entryContent = match[1].trim();
		const entry = parseEntry(entryContent);
		if (entry) {
			entries.push(entry);
		}
	}

	return { entries };
}

/**
 * Parse a single changelog entry
 */
function parseEntry(content: string): ChangelogEntry | null {
	const lines = content.split('\n');

	// Parse version and date: ## [1.0.0] - 2025-12-16
	const versionMatch = lines[0]?.match(/^##\s*\[([^\]]+)\]\s*-\s*(\d{4}-\d{2}-\d{2})/);
	if (!versionMatch) {
		return null;
	}

	const [, version, date] = versionMatch;

	// Parse commit hash: @@commit:abc123@@
	const commitMatch = content.match(/@@commit:([a-f0-9]+)@@/);
	const commitHash = commitMatch?.[1];

	// Parse title: @@title:Some Title@@
	const titleMatch = content.match(/@@title:(.+?)@@/);
	const title = titleMatch?.[1];

	// Parse description (text between title line and first ### section)
	let description = '';
	const titleLineEnd = content.indexOf('@@\n', content.indexOf('@@title:'));
	const firstSection = content.indexOf('\n### ');

	if (titleLineEnd !== -1 && firstSection > titleLineEnd) {
		description = content.substring(titleLineEnd + 3, firstSection).trim();
	}

	// Parse change sections
	const changes: ChangeItem[] = [];
	const sectionRegex = /### ::(\w+)::\n([\s\S]*?)(?=### ::|<!--CHANGELOG_ENTRY_END-->|$)/g;
	let sectionMatch;

	while ((sectionMatch = sectionRegex.exec(content)) !== null) {
		const type = sectionMatch[1];
		const sectionContent = sectionMatch[2];

		if (!isValidChangeType(type)) {
			continue;
		}

		// Parse individual changes with hash
		// Format: - **description** @@hash:abc1234@@\n  ``component``
		const changeRegex = /-\s*\*\*(.+?)\*\*\s*@@hash:([a-f0-9]+)@@(?:\n\s*``([^`]+)``)?/g;
		let changeMatch;

		while ((changeMatch = changeRegex.exec(sectionContent)) !== null) {
			const changeDescription = changeMatch[1].trim();
			const changeHash = changeMatch[2].trim();
			const component = changeMatch[3]?.trim();

			changes.push({
				type,
				description: changeDescription,
				commitHash: changeHash,
				...(component && { component })
			});
		}
	}

	return {
		version,
		date,
		...(commitHash && { commitHash }),
		...(title && { title }),
		...(description && { description }),
		changes
	};
}

const changelog = parseChangelog(changelogRaw);

export function getChangelog(): Changelog {
	return changelog;
}

export function getChangelogEntries(): ChangelogEntry[] {
	return changelog.entries;
}

export function getLatestVersion(): string {
	const entries = getChangelogEntries();
	return entries.length > 0 ? entries[0].version : '0.0.0';
}

export function getEntryByVersion(version: string): ChangelogEntry | undefined {
	return getChangelogEntries().find((entry) => entry.version === version);
}

export function getCommitUrl(hash: string): string {
	return `https://github.com/antoniosarro/antoniosarro.dev/commit/${hash}`;
}
