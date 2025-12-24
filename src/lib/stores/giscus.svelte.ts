type GiscusStatus = 'mounted' | 'removed' | 'loaded' | 'error' | undefined;

class GiscusStatusStore {
	current = $state<GiscusStatus>(undefined);

	set(value: GiscusStatus) {
		this.current = value;
	}

	reset() {
		this.current = undefined;
	}
}

export const giscusStatus = new GiscusStatusStore();
