export interface SeriesConfig {
	slug: string;
	title: string;
	description: string;
	image?: string;
}

export const seriesConfig: SeriesConfig[] = [
	{
		slug: 'homelab',
		title: 'Homelab Adventures',
		description:
			'A complete guide to building and maintaining your own homelab infrastructure',
		image: '/images/series/homelab.webp'
	}
];

export function getSeriesConfig(slug: string): SeriesConfig | undefined {
	return seriesConfig.find((s) => s.slug === slug);
}
