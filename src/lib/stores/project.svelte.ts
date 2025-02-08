import { getContext, setContext } from 'svelte';

export class ProjectState {
	personal = $state(false);
	contribution = $state(false);

	constructor() {}
}

const PROJECT_KEY = Symbol('PROJECT');

export function setProjectState() {
	return setContext(PROJECT_KEY, new ProjectState());
}

export function getProjectState() {
	return getContext<ReturnType<typeof setProjectState>>(PROJECT_KEY);
}
