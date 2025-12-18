export interface Frontmatter {
	title: string;
	description: string;
	publishedAt: string;
	image?: string;
	tags: string[];
	draft: boolean;
	readingTime: ReadingTime;
	series?: string;
	seriesOrder?: number;
}

export interface ReadingTime {
	minutes: number;
	text: string;
	time: number;
	words: number;
}

export interface Blog {
	slug: string;
	frontmatter: Frontmatter;
	views?: number;
}

export interface Series {
	slug: string;
	title: string;
	description: string;
	image?: string;
	posts: Blog[];
	totalPosts: number;
}

export interface BlogFilters {
	search: string;
	tags: string[];
	showSeries: boolean;
}
