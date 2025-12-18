import { getContext, setContext } from 'svelte';

export class ProjectState {
	personal = $state(false);
	contribution = $state(false);

	toggle(key: 'personal' | 'contribution') {
		this[key] = !this[key];
	}

	reset() {
		this.personal = false;
		this.contribution = false;
	}

	get hasActiveFilters() {
		return this.personal || this.contribution;
	}
}

const PROJECT_KEY = Symbol('PROJECT');

export function setProjectState() {
	return setContext(PROJECT_KEY, new ProjectState());
}

export function getProjectState() {
	return getContext<ReturnType<typeof setProjectState>>(PROJECT_KEY);
}
