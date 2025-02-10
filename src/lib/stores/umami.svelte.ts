import { writable } from 'svelte/store';

const lastStatus: boolean =
	typeof localStorage !== 'undefined'
		? JSON.parse(localStorage.getItem('umami') || '{"enabled": true}').enabled
		: true;

export const isEnabled = writable<boolean>(lastStatus);

isEnabled.subscribe((value) => {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem('umami', JSON.stringify({ enabled: value }));
	}
});

export const status = writable<undefined | 'mounted' | 'removed' | 'loaded' | 'error'>(undefined);
