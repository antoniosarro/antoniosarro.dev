import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const VIEWS_FILE = join(process.cwd(), 'data', 'views.json');

interface ViewsData {
	[slug: string]: {
		views: number;
		lastUpdated: string;
	};
}

// Ensure data directory exists
import { mkdirSync } from 'fs';
const dataDir = join(process.cwd(), 'data');
if (!existsSync(dataDir)) {
	mkdirSync(dataDir, { recursive: true });
}

function readViewsFile(): ViewsData {
	if (!existsSync(VIEWS_FILE)) {
		// Initialize with empty object if file doesn't exist
		const initialData = {};
		writeViewsFile(initialData);
		return initialData;
	}

	try {
		const content = readFileSync(VIEWS_FILE, 'utf8');
		return JSON.parse(content);
	} catch (error) {
		console.error('Error reading views file:', error);
		// Return empty object and try to recreate file
		const fallbackData = {};
		writeViewsFile(fallbackData);
		return fallbackData;
	}
}

function writeViewsFile(data: ViewsData): void {
	try {
		writeFileSync(VIEWS_FILE, JSON.stringify(data, null, 2));
	} catch (error) {
		console.error('Error writing views file:', error);
	}
}

// Rest of your functions remain the same...
export function getPostViews(slug: string): number {
	const data = readViewsFile();
	return data[slug]?.views || 0;
}

export function incrementPostViews(slug: string): number {
	const data = readViewsFile();

	if (!data[slug]) {
		data[slug] = { views: 0, lastUpdated: new Date().toISOString() };
	}

	data[slug].views += 1;
	data[slug].lastUpdated = new Date().toISOString();

	writeViewsFile(data);
	return data[slug].views;
}

export function getAllPostViews(): Record<string, number> {
	const data = readViewsFile();
	const result: Record<string, number> = {};

	for (const [slug, info] of Object.entries(data)) {
		result[slug] = info.views;
	}

	return result;
}

export function getBatchViews(slugs: string[]): Record<string, number> {
	const data = readViewsFile();
	const result: Record<string, number> = {};

	for (const slug of slugs) {
		result[slug] = data[slug]?.views || 0;
	}

	return result;
}

export function trackPostView(slug: string, userAgent: string | null): number {
	if (userAgent) {
		const botPatterns = [
			/bot/i,
			/crawler/i,
			/spider/i,
			/scraper/i,
			/facebookexternalhit/i,
			/twitterbot/i,
			/linkedinbot/i,
			/googlebot/i,
			/bingbot/i,
			/slurp/i
		];

		if (botPatterns.some((pattern) => pattern.test(userAgent))) {
			return getPostViews(slug);
		}
	}

	return incrementPostViews(slug);
}
