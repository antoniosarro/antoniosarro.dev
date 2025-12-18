import { BROWSER } from 'esm-env';

export function getStoredValue(): boolean {
	if (!BROWSER) return true;

	try {
		const stored = localStorage.getItem('umami');
		return stored ? JSON.parse(stored).enabled : true;
	} catch {
		return true;
	}
}

export function setStoredValue(enabled: boolean): void {
	if (!BROWSER) return;

	try {
		localStorage.setItem('umami', JSON.stringify({ enabled }));
	} catch {
		// Silently fail if localStorage is unavailable
	}
}
