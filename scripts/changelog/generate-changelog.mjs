#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { parseArgs } from 'util';

/**
 * @typedef {Object} ParsedArgs
 * @property {string} [version]
 * @property {string} [title]
 * @property {string} [base]
 * @property {string} [head]
 * @property {boolean} [use-llm]
 * @property {boolean} [include-diffs]
 * @property {string} [max-diff-lines]
 */

/**
 * @typedef {Object} FileChange
 * @property {string} path
 * @property {string} change
 * @property {string} [commitHash]
 * @property {string} [commitTitle]
 */

/**
 * @typedef {'added' | 'changed' | 'fixed' | 'security' | 'moved' | 'removed'} ChangeType
 */

/**
 * @typedef {Object} ParsedCommit
 * @property {ChangeType} type
 * @property {string} area
 * @property {string} title
 * @property {string} description
 * @property {FileChange[]} files
 * @property {string} hash
 * @property {string} shortHash
 * @property {string | null} diff
 */

/**
 * @typedef {Object} GroupedChanges
 * @property {ChangeType} type
 * @property {FileChange[]} changes
 */

/**
 * @typedef {Object} GeneratedContent
 * @property {string} title
 * @property {string} description
 */

/**
 * @typedef {Object} GeminiResponse
 * @property {Array<{content: {parts: Array<{text: string}>}}>} [candidates]
 * @property {{totalTokenCount?: number}} [usageMetadata]
 */

const { values: args } = parseArgs({
	options: {
		version: { type: 'string' },
		title: { type: 'string' },
		base: { type: 'string' },
		head: { type: 'string' },
		'use-llm': { type: 'boolean', default: false },
		'include-diffs': { type: 'boolean', default: false },
		'max-diff-lines': { type: 'string', default: '50' }
	}
});

/** @type {Record<string, ChangeType>} */
const TYPE_MAP = {
	feat: 'added',
	fix: 'fixed',
	change: 'changed',
	remove: 'removed',
	move: 'moved',
	security: 'security',
	add: 'added',
	update: 'changed',
	refactor: 'changed',
	delete: 'removed',
	perf: 'changed'
};

/** @type {Record<ChangeType, string>} */
const TYPE_LABELS = {
	added: 'adds',
	changed: 'improves',
	fixed: 'fixes',
	security: 'includes security updates for',
	moved: 'reorganizes',
	removed: 'removes'
};

/** @type {ChangeType[]} */
const TYPE_ORDER = [
	'added',
	'changed',
	'fixed',
	'security',
	'moved',
	'removed'
];

/**
 * Get the diff for a specific commit
 *
 * @param {string} hash - The commit hash
 * @param {number} [maxLines=50] - Maximum number of lines to include
 * @returns {string | null} The diff content or null if unavailable
 */
function getCommitDiff(hash, maxLines = 50) {
	try {
		const diff = execSync(
			`git show ${hash} --pretty="" --unified=3 -- . \
        ':!package-lock.json' \
        ':!pnpm-lock.yaml' \
        ':!yarn.lock' \
        ':!*.min.js' \
        ':!*.min.css' \
        ':!dist/*' \
        ':!build/*'`,
			{ encoding: 'utf-8', maxBuffer: 1024 * 1024 * 10 }
		).trim();

		if (!diff) return null;

		const lines = diff.split('\n');
		if (lines.length > maxLines) {
			return (
				lines.slice(0, maxLines).join('\n') +
				`\n... (truncated, ${lines.length - maxLines} more lines)`
			);
		}

		return diff;
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		console.warn(
			`   ⚠️  Could not get diff for ${hash.substring(0, 7)}: ${message}`
		);
		return null;
	}
}

/**
 * Get the full diff between base and head
 *
 * @param {string} base - The base commit/branch
 * @param {string} head - The head commit/branch
 * @param {number} [maxLines=500] - Maximum number of lines to include
 * @returns {string | null} The diff content or null if unavailable
 */
function getFullDiff(base, head, maxLines = 500) {
	try {
		const diff = execSync(
			`git diff ${base}..${head} --unified=3 -- . \
        ':!package-lock.json' \
        ':!pnpm-lock.yaml' \
        ':!yarn.lock' \
        ':!*.min.js' \
        ':!*.min.css' \
        ':!dist/*' \
        ':!build/*'`,
			{ encoding: 'utf-8', maxBuffer: 1024 * 1024 * 10 }
		).trim();

		if (!diff) return null;

		const lines = diff.split('\n');
		if (lines.length > maxLines) {
			return (
				lines.slice(0, maxLines).join('\n') +
				`\n... (truncated, ${lines.length - maxLines} more lines)`
			);
		}

		return diff;
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		console.warn(`⚠️  Could not get full diff: ${message}`);
		return null;
	}
}

/**
 * Summarize diff for LLM (extract most important parts)
 *
 * @param {string | null} diff - The full diff content
 * @param {number} [maxLength=8000] - Maximum character length for the summary
 * @returns {string} Summarized diff content
 */
function summarizeDiffForLLM(diff, maxLength = 8000) {
	if (!diff) return '';

	const fileSections = diff.split(/^diff --git/m).filter(Boolean);
	/** @type {string[]} */
	const summaries = [];
	let totalLength = 0;

	for (const section of fileSections) {
		const fileMatch = section.match(/a\/(.+?) b\//);
		const filename = fileMatch ? fileMatch[1] : 'unknown';

		if (
			filename.endsWith('.lock') ||
			(filename.endsWith('.json') && filename.includes('lock')) ||
			filename.includes('node_modules')
		) {
			continue;
		}

		const changes = section
			.split('\n')
			.filter((line) => line.startsWith('+') || line.startsWith('-'))
			.filter((line) => !line.startsWith('+++') && !line.startsWith('---'))
			.slice(0, 20)
			.join('\n');

		if (changes) {
			const summary = `File: ${filename}\n${changes}`;

			if (totalLength + summary.length > maxLength) {
				summaries.push('... (more files changed)');
				break;
			}

			summaries.push(summary);
			totalLength += summary.length;
		}
	}

	return summaries.join('\n\n');
}

/**
 * Generate title and description using Google Gemini API
 *
 * @param {(ParsedCommit | null)[]} commits - Array of parsed commits
 * @param {string | undefined} prTitle - The PR title
 * @param {string | null} [diffContext=null] - Optional diff context for better generation
 * @returns {Promise<GeneratedContent | null>} Generated content or null if failed
 */
async function generateWithGemini(commits, prTitle, diffContext = null) {
	const apiKey = process.env.GEMINI_API_KEY;

	if (!apiKey) {
		console.warn(
			'⚠️  GEMINI_API_KEY not set, falling back to basic generation'
		);
		return null;
	}

	const commitSummary = commits
		.filter(/** @param {ParsedCommit | null} c */ (c) => c !== null)
		.map((c) => {
			const files = c.files.map((f) => `  - ${f.path}: ${f.change}`).join('\n');
			let summary = `${c.type}(${c.area}): ${c.title}`;
			if (c.description) {
				summary += `\n${c.description}`;
			}
			if (files) {
				summary += `\nFiles:\n${files}`;
			}
			return summary;
		})
		.join('\n\n');

	let prompt = `You are writing a changelog entry for a software release. Based on the following information, generate a title and description.

Requirements:
- Title: Short, catchy, max 15 words. Summarize the main theme of the release. Don't include version number.
- Description: 2-3 sentences. Professional but engaging. Focus on user-facing changes and benefits. Don't start with "This release".

PR Title: ${prTitle || 'New Release'}

Commits:
${commitSummary}`;

	if (diffContext) {
		prompt += `

Code Changes (diff summary):
\`\`\`
${diffContext}
\`\`\``;
	}

	prompt += `

Respond in this exact JSON format (no markdown, no code blocks):
{"title": "Your Short Title Here", "description": "Your description here. It can be multiple sentences."}`;

	try {
		const response = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					contents: [
						{
							parts: [{ text: prompt }]
						}
					],
					generationConfig: {
						temperature: 0.7,
						maxOutputTokens: 300
					}
				})
			}
		);

		if (!response.ok) {
			const error = await response.text();
			console.warn(`⚠️  Gemini API error: ${error}`);
			return null;
		}

		/** @type {GeminiResponse} */
		const data = await response.json();
		const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

		if (!text) {
			return null;
		}

		// Parse JSON response
		try {
			// Clean up the response (remove markdown code blocks if present)
			const cleanedText = text
				.replace(/```json\n?/g, '')
				.replace(/```\n?/g, '')
				.trim();

			/** @type {{title?: string, description?: string}} */
			const parsed = JSON.parse(cleanedText);

			if (parsed.title && parsed.description) {
				console.log('✨ Generated title and description with Gemini');
				console.log(
					`   Tokens used: ${data.usageMetadata?.totalTokenCount || 'N/A'}`
				);
				return {
					title: parsed.title,
					description: parsed.description
				};
			}
		} catch (parseError) {
			const message =
				parseError instanceof Error ? parseError.message : String(parseError);
			console.warn(`⚠️  Failed to parse Gemini response: ${message}`);
			console.warn(`   Response was: ${text.substring(0, 200)}`);
		}

		return null;
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		console.warn(`⚠️  Gemini request failed: ${message}`);
		return null;
	}
}

/**
 * Generate title locally (fallback)
 *
 * @param {(ParsedCommit | null)[]} commits - Array of parsed commits
 * @param {string | undefined} prTitle - The PR title
 * @returns {string} Generated title
 */
function generateTitleLocal(commits, prTitle) {
	const validCommits = commits.filter(
		/** @param {ParsedCommit | null} c */ (c) => c !== null
	);

	if (validCommits.length === 0) {
		return prTitle || 'Updates and Improvements';
	}

	// Count by type
	/** @type {Map<ChangeType, number>} */
	const typeCounts = new Map();
	for (const commit of validCommits) {
		typeCounts.set(commit.type, (typeCounts.get(commit.type) || 0) + 1);
	}

	// Find dominant type
	const dominantType = [...typeCounts.entries()].sort(
		(a, b) => b[1] - a[1]
	)[0]?.[0];

	// Get unique areas
	const areas = [...new Set(validCommits.map((c) => c.area))];

	// Generate title based on dominant type and areas
	/** @type {Record<ChangeType, string>} */
	const typeLabels = {
		added: 'New Features',
		fixed: 'Bug Fixes',
		changed: 'Improvements',
		security: 'Security Updates',
		removed: 'Cleanup',
		moved: 'Restructuring'
	};

	if (areas.length === 1) {
		return `${dominantType ? typeLabels[dominantType] : 'Updates'} for ${areas[0]}`;
	}

	if (typeCounts.size === 1 && dominantType) {
		return typeLabels[dominantType] || 'Updates and Improvements';
	}

	// Mixed release
	/** @type {string[]} */
	const parts = [];
	if (typeCounts.has('added')) parts.push('Features');
	if (typeCounts.has('fixed')) parts.push('Fixes');
	if (typeCounts.has('changed')) parts.push('Improvements');

	if (parts.length > 0) {
		return parts.slice(0, 2).join(' & ');
	}

	return prTitle || 'Updates and Improvements';
}

/**
 * Generate description locally (fallback)
 *
 * @param {(ParsedCommit | null)[]} commits - Array of parsed commits
 * @param {string | undefined} prTitle - The PR title
 * @returns {string} Generated description
 */
function generateDescriptionLocal(commits, prTitle) {
	const validCommits = commits.filter(
		/** @param {ParsedCommit | null} c */ (c) => c !== null
	);

	if (validCommits.length === 0) {
		return prTitle || 'Various updates and improvements.';
	}

	/** @type {Map<ChangeType, ParsedCommit[]>} */
	const byType = new Map();
	for (const commit of validCommits) {
		const existing = byType.get(commit.type) || [];
		existing.push(commit);
		byType.set(commit.type, existing);
	}

	/** @type {string[]} */
	const parts = [];

	for (const type of TYPE_ORDER) {
		const typeCommits = byType.get(type);
		if (!typeCommits || typeCommits.length === 0) continue;

		const label = TYPE_LABELS[type];

		if (typeCommits.length === 1) {
			const commit = typeCommits[0];
			const text = commit.description || commit.title;
			const firstSentence = text.split(/[.!?]/)[0].trim();
			parts.push(
				`${label} ${firstSentence.charAt(0).toLowerCase()}${firstSentence.slice(1)}`
			);
		} else {
			const areas = [...new Set(typeCommits.map((c) => c.area))];
			if (areas.length === 1) {
				parts.push(`${label} ${areas[0]}`);
			} else if (areas.length === 2) {
				parts.push(`${label} ${areas[0]} and ${areas[1]}`);
			} else {
				const lastArea = areas.pop();
				parts.push(`${label} ${areas.join(', ')}, and ${lastArea}`);
			}
		}
	}

	if (parts.length === 0) {
		return prTitle || 'Various updates and improvements.';
	}

	if (parts.length === 1) {
		return `This release ${parts[0]}.`;
	}

	if (parts.length === 2) {
		return `This release ${parts[0]} and ${parts[1]}.`;
	}

	const lastPart = parts.pop();
	return `This release ${parts.join(', ')}, and ${lastPart}.`;
}

/**
 * Main generator - tries LLM first, falls back to local
 *
 * @param {(ParsedCommit | null)[]} commits - Array of parsed commits
 * @param {string | undefined} prTitle - The PR title
 * @param {boolean} useLLM - Whether to use LLM generation
 * @param {string | null} [diffContext=null] - Optional diff context
 * @returns {Promise<GeneratedContent>} Generated title and description
 */
async function generateTitleAndDescription(
	commits,
	prTitle,
	useLLM,
	diffContext = null
) {
	if (useLLM) {
		const llmResult = await generateWithGemini(commits, prTitle, diffContext);
		if (llmResult) {
			return llmResult;
		}
		console.log('   Falling back to local generation...');
	}

	return {
		title: generateTitleLocal(commits, prTitle),
		description: generateDescriptionLocal(commits, prTitle)
	};
}

/**
 * Parse a commit message
 *
 * @param {string} hash - The commit hash
 * @param {boolean} [includeDiff=false] - Whether to include diff content
 * @param {number} [maxDiffLines=50] - Maximum diff lines to include
 * @returns {ParsedCommit | null} Parsed commit or null if not conventional format
 */
function parseCommit(hash, includeDiff = false, maxDiffLines = 50) {
	const fullHash = execSync(`git rev-parse ${hash}`, {
		encoding: 'utf-8'
	}).trim();
	const shortHash = fullHash.substring(0, 7);

	const message = execSync(`git log -1 --pretty=format:"%B" ${hash}`, {
		encoding: 'utf-8'
	}).trim();

	const lines = message.split('\n');
	const firstLine = lines[0];

	const headerRegex = /^(\w+)\(([^)]+)\):\s*(.+)$/;
	const match = firstLine.match(headerRegex);

	if (!match) {
		return null;
	}

	const [, type, area, title] = match;
	const changeType = TYPE_MAP[type.toLowerCase()];

	if (!changeType) {
		return null;
	}

	const filesIndex = lines.findIndex(
		(l) => l.trim().toLowerCase() === 'files:'
	);

	let description = '';
	if (filesIndex > 1) {
		description = lines.slice(1, filesIndex).join(' ').trim();
	} else if (filesIndex === -1 && lines.length > 1) {
		description = lines.slice(1).join(' ').trim();
	}

	/** @type {FileChange[]} */
	const files = [];
	if (filesIndex !== -1) {
		for (let i = filesIndex + 1; i < lines.length; i++) {
			const line = lines[i].trim();
			if (!line) continue;

			const fileMatch = line.match(/^-\s*([^:]+):\s*(.+)$/);
			if (fileMatch) {
				files.push({
					path: fileMatch[1].trim(),
					change: capitalizeFirst(fileMatch[2].trim())
				});
			}
		}
	}

	/** @type {string | null} */
	let diff = null;
	if (includeDiff) {
		diff = getCommitDiff(hash, maxDiffLines);
	}

	return {
		type: changeType,
		area,
		title: capitalizeFirst(title.trim()),
		description,
		files,
		hash: fullHash,
		shortHash,
		diff
	};
}

/**
 * Capitalize the first character of a string
 *
 * @param {string} str - The string to capitalize
 * @returns {string} The capitalized string
 */
function capitalizeFirst(str) {
	if (!str) return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get commit hashes between base and head
 *
 * @param {string} base - The base commit/branch
 * @param {string} head - The head commit/branch
 * @returns {string[]} Array of commit hashes
 */
function getCommitHashes(base, head) {
	try {
		const output = execSync(
			`git log ${base}..${head} --pretty=format:"%H" --no-merges`,
			{
				encoding: 'utf-8'
			}
		);

		return output.split('\n').filter(Boolean);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		console.error('Error getting commits:', message);
		return [];
	}
}

/**
 * Group commits by their change type
 *
 * @param {(ParsedCommit | null)[]} commits - Array of parsed commits
 * @returns {GroupedChanges[]} Grouped changes by type
 */
function groupByType(commits) {
	/** @type {Map<ChangeType, FileChange[]>} */
	const groups = new Map();

	for (const commit of commits) {
		if (!commit) continue;

		const existing = groups.get(commit.type) || [];

		/** @type {FileChange[]} */
		const changesWithHash = commit.files.map((file) => ({
			...file,
			commitHash: commit.shortHash,
			commitTitle: commit.title
		}));

		if (changesWithHash.length === 0) {
			changesWithHash.push({
				path: commit.area,
				change: commit.title,
				commitHash: commit.shortHash,
				commitTitle: commit.title
			});
		}

		existing.push(...changesWithHash);
		groups.set(commit.type, existing);
	}

	return TYPE_ORDER.filter((type) => groups.has(type)).map((type) => ({
		type,
		changes: /** @type {FileChange[]} */ (groups.get(type))
	}));
}

/**
 * Generate markdown for a changelog entry
 *
 * @param {string} version - The version number
 * @param {string} title - The release title
 * @param {string} description - The release description
 * @param {string} commitHash - The commit hash for this release
 * @param {GroupedChanges[]} groupedChanges - The grouped changes
 * @returns {string} Markdown content for the entry
 */
function generateEntryMarkdown(
	version,
	title,
	description,
	commitHash,
	groupedChanges
) {
	const date = new Date().toISOString().split('T')[0];

	let md = `<!--CHANGELOG_ENTRY_START-->\n`;
	md += `## [${version}] - ${date}\n`;
	md += `@@commit:${commitHash}@@\n`;
	md += `@@title:${title}@@\n\n`;

	if (description) {
		md += `${description}\n\n`;
	}

	for (const { type, changes } of groupedChanges) {
		md += `### ::${type}::\n`;

		for (const change of changes) {
			md += `- **${change.change}** @@hash:${change.commitHash}@@\n`;
			if (change.path) {
				md += `  \`\`${change.path}\`\`\n`;
			}
		}

		md += '\n';
	}

	md += `<!--CHANGELOG_ENTRY_END-->`;

	return md;
}

/**
 * Get existing changelog or create a new one
 *
 * @returns {string} The changelog content
 */
function getOrCreateChangelog() {
	const initialContent = `# Changelog

All notable changes to antoniosarro.dev are documented here.

---

`;

	if (!existsSync('CHANGELOG.md')) {
		writeFileSync('CHANGELOG.md', initialContent);
		return initialContent;
	}

	return readFileSync('CHANGELOG.md', 'utf-8');
}

/**
 * Insert a new entry into the changelog
 *
 * @param {string} changelog - The existing changelog content
 * @param {string} newEntry - The new entry to insert
 * @returns {string} The updated changelog content
 */
function insertEntry(changelog, newEntry) {
	const separator = '---\n';
	const separatorIndex = changelog.indexOf(separator);

	if (separatorIndex === -1) {
		return changelog + '\n' + separator + '\n' + newEntry + '\n';
	}

	const header = changelog.substring(0, separatorIndex + separator.length);
	const existingEntries = changelog.substring(
		separatorIndex + separator.length
	);

	return header + '\n' + newEntry + '\n\n' + existingEntries.trim() + '\n';
}

/**
 * Main execution
 *
 * @returns {Promise<void>}
 */
async function main() {
	const { version, title, base, head } = /** @type {ParsedArgs} */ (args);
	const useLLM = /** @type {boolean} */ (args['use-llm']);
	const includeDiffs = /** @type {boolean} */ (args['include-diffs']);
	const maxDiffLines = parseInt(
		/** @type {string} */ (args['max-diff-lines']),
		10
	);

	if (!version || !base || !head) {
		console.error('Missing required arguments: --version, --base, --head');
		process.exit(1);
	}

	console.log(`\n📋 Generating changelog for v${version}`);
	console.log(`   Base: ${base.substring(0, 7)}`);
	console.log(`   Head: ${head.substring(0, 7)}`);
	console.log(`   Use LLM: ${useLLM ? 'yes' : 'no'}`);
	console.log(`   Include diffs: ${includeDiffs ? 'yes' : 'no'}\n`);

	const commitHashes = getCommitHashes(base, head);
	console.log(`📦 Found ${commitHashes.length} commits\n`);

	/** @type {(ParsedCommit | null)[]} */
	const parsedCommits = commitHashes.map((hash) => {
		const parsed = parseCommit(hash, includeDiffs, maxDiffLines);
		if (parsed) {
			console.log(
				`   ✓ ${parsed.shortHash} ${parsed.type}(${parsed.area}): ${parsed.title}`
			);
			if (parsed.diff) {
				console.log(
					`     📄 Diff included (${parsed.diff.split('\n').length} lines)`
				);
			}
		} else {
			console.log(
				`   ✗ ${hash.substring(0, 7)} (skipped - not conventional format)`
			);
		}
		return parsed;
	});

	const validCommits = parsedCommits.filter(
		/** @param {ParsedCommit | null} c */ (c) => c !== null
	);

	if (validCommits.length === 0) {
		console.warn(
			'\n⚠️  No conventional commits found. Creating minimal entry.'
		);
	}

	const groupedChanges = groupByType(validCommits);

	/** @type {string} */
	let mergeCommitHash;
	try {
		mergeCommitHash = execSync('git rev-parse HEAD', {
			encoding: 'utf-8'
		}).trim();
	} catch {
		mergeCommitHash = head;
	}

	// Prepare diff context for LLM if requested
	/** @type {string | null} */
	let diffContext = null;
	if (useLLM && includeDiffs) {
		console.log('\n📄 Preparing diff context for LLM...');

		const fullDiff = getFullDiff(base, head, 500);
		diffContext = summarizeDiffForLLM(fullDiff, 8000);

		if (diffContext) {
			console.log(`   Diff context prepared (${diffContext.length} chars)`);
		}
	}

	console.log('\n📝 Generating title and description...');
	const { title: generatedTitle, description } =
		await generateTitleAndDescription(validCommits, title, useLLM, diffContext);

	console.log(`   Title: "${generatedTitle}"`);
	console.log(
		`   Description: "${description.substring(0, 80)}${description.length > 80 ? '...' : ''}"`
	);

	const entryMarkdown = generateEntryMarkdown(
		version,
		generatedTitle,
		description,
		mergeCommitHash,
		groupedChanges
	);

	const changelog = getOrCreateChangelog();
	const updatedChangelog = insertEntry(changelog, entryMarkdown);

	writeFileSync('CHANGELOG.md', updatedChangelog);

	console.log(`\n✅ Changelog updated for v${version}`);
	console.log(`   • ${validCommits.length} commits processed`);
	console.log(`   • ${groupedChanges.length} change type sections`);
	console.log(
		`   • ${groupedChanges.reduce((acc, g) => acc + g.changes.length, 0)} total changes\n`
	);
}

main().catch(console.error);
