import type { Plugin } from 'vite';

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

interface VersionInfo {
	version: string;
	commitHash: string;
	commitHashShort: string;
	buildDate: string;
}

function getVersionInfo(): VersionInfo {
	const packageJsonPath = path.resolve(process.cwd(), 'package.json');
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
	const version = packageJson.version || '0.0.0';

	let commitHash = 'development';
	let commitHashShort = 'dev';

	try {
		commitHash = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
		commitHashShort = commitHash.substring(0, 7);
	} catch {
		const envCommit =
			process.env.GITHUB_SHA ||
			process.env.CI_COMMIT_SHA ||
			process.env.COMMIT_SHA ||
			process.env.GIT_COMMIT;

		if (envCommit) {
			commitHash = envCommit;
			commitHashShort = envCommit.substring(0, 7);
		}
	}

	return {
		version,
		commitHash,
		commitHashShort,
		buildDate: new Date().toISOString()
	};
}

export function versionPlugin(): Plugin {
	const versionInfo = getVersionInfo();

	return {
		name: 'vite-version-plugin',
		config() {
			return {
				define: {
					__APP_VERSION__: JSON.stringify(versionInfo.version),
					__COMMIT_HASH__: JSON.stringify(versionInfo.commitHash),
					__COMMIT_HASH_SHORT__: JSON.stringify(versionInfo.commitHashShort),
					__BUILD_DATE__: JSON.stringify(versionInfo.buildDate)
				}
			};
		}
	};
}
