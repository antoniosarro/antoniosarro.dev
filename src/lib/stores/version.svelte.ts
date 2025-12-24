class VersionStore {
	readonly version: string = __APP_VERSION__;
	readonly commitHash: string = __COMMIT_HASH__;
	readonly commitHashShort: string = __COMMIT_HASH_SHORT__;
	readonly buildDate: string = __BUILD_DATE__;

	get githubCommitUrl(): string {
		if (this.commitHash === 'development') return '#';
		return `https://github.com/antoniosarro/antoniosarro.dev_old/commit/${this.commitHash}`;
	}

	get displayVersion(): string {
		return `v${this.version}`;
	}

	get fullVersion(): string {
		return `v${this.version} (${this.commitHashShort})`;
	}
}

export const versionInfo = new VersionStore();
