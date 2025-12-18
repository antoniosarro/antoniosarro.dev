import { getStoredValue, setStoredValue } from '$lib/utils/localstorage';

type UmamiStatus = 'mounted' | 'removed' | 'loaded' | 'error' | undefined;

class UmamiStatusStore {
	current = $state<UmamiStatus>(undefined);

	set(value: UmamiStatus) {
		this.current = value;
	}

	reset() {
		this.current = undefined;
	}
}

export const status = new UmamiStatusStore();
