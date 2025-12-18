import { getContext, setContext } from 'svelte';

export class BlogFilterState {
	search = $state('');
	selectedTags = $state<string[]>([]);
	viewMode = $state<'all' | 'standalone' | 'series'>('all');

	toggleTag(tag: string) {
		if (this.selectedTags.includes(tag)) {
			this.selectedTags = this.selectedTags.filter((t) => t !== tag);
		} else {
			this.selectedTags = [...this.selectedTags, tag];
		}
	}

	clearTags() {
		this.selectedTags = [];
	}

	clearSearch() {
		this.search = '';
	}

	clearAll() {
		this.search = '';
		this.selectedTags = [];
		this.viewMode = 'all';
	}

	get hasActiveFilters() {
		return this.search.length > 0 || this.selectedTags.length > 0 || this.viewMode !== 'all';
	}
}

const BLOG_FILTER_KEY = Symbol('BLOG_FILTER');

export function setBlogFilterState() {
	return setContext(BLOG_FILTER_KEY, new BlogFilterState());
}

export function getBlogFilterState() {
	return getContext<ReturnType<typeof setBlogFilterState>>(BLOG_FILTER_KEY);
}
