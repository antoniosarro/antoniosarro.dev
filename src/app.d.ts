import 'unplugin-icons/types/svelte';

declare global {
	namespace App {}

	// Version info injected at build time
	declare const __APP_VERSION__: string;
	declare const __COMMIT_HASH__: string;
	declare const __COMMIT_HASH_SHORT__: string;
	declare const __BUILD_DATE__: string;
}

export {};
