export interface Frontmatter {
	title: string;
	description: string;
	publishedAt: string;
	image?: string;
	tags: string[];
	draft: boolean;
	readingTime: ReadingTime;
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
}
