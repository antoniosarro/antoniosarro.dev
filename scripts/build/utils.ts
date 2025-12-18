import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// ============================================
// Types
// ============================================

export interface FontFamily {
	name: string;
	files: string[];
	subset: string;
}

export interface FontConfig {
	family: string;
	file: string;
}

export interface OptimizationResult {
	file: string;
	originalSize: number;
	optimizedSize: number;
	reduction: number;
	success: boolean;
	error?: string;
}

export interface FontStats {
	totalOriginalSize: number;
	totalOptimizedSize: number;
	totalReduction: number;
	results: OptimizationResult[];
}

// ============================================
// Configuration
// ============================================

export const PATHS = {
	fonts: 'assets/fonts',
	build: 'build',
	optimized: 'static/fonts',
	buildFonts: 'build/fonts',
	temp: '/tmp/glyphs.txt'
} as const;

export const FONT_FAMILIES: FontFamily[] = [
	{
		name: 'incognito',
		files: [
			'incognito_regular.woff2',
			'incognito_medium.woff2',
			'incognito_condensed.woff2',
			'incognito_bold.woff2'
		],
		subset: 'latin'
	},
	{
		name: 'inter',
		files: [
			'inter-latin-400-normal.woff2',
			'inter-latin-600-normal.woff2',
			'inter-latin-700-normal.woff2',
			'inter-latin-800-normal.woff2'
		],
		subset: 'latin'
	}
];

// ============================================
// Logger
// ============================================

const COLORS = {
	reset: '\x1b[0m',
	bright: '\x1b[1m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	red: '\x1b[31m',
	cyan: '\x1b[36m',
	blue: '\x1b[34m'
} as const;

export const logger = {
	info(message: string): void {
		console.log(`${COLORS.cyan}ℹ${COLORS.reset} ${message}`);
	},

	success(message: string): void {
		console.log(`${COLORS.green}✔${COLORS.reset} ${message}`);
	},

	error(message: string): void {
		console.error(`${COLORS.red}✗${COLORS.reset} ${message}`);
	},

	warn(message: string): void {
		console.warn(`${COLORS.yellow}⚠${COLORS.reset} ${message}`);
	},

	header(message: string): void {
		console.log(`\n${COLORS.bright}${COLORS.blue}${message}${COLORS.reset}\n`);
	},

	subheader(message: string): void {
		console.log(`${COLORS.bright}${message}${COLORS.reset}`);
	},

	stats(file: string, originalKB: string, optimizedKB: string, reduction: number): void {
		console.log(
			`  ${COLORS.green}✔${COLORS.reset} ${file}: ${originalKB}KB → ${optimizedKB}KB ${COLORS.green}(${reduction}% reduction)${COLORS.reset}`
		);
	}
};

// ============================================
// File Utilities
// ============================================

export const fileUtils = {
	ensureDirectoryExists(dirPath: string): void {
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
		}
	},

	getFileSize(filePath: string): number {
		try {
			return fs.statSync(filePath).size;
		} catch {
			return 0;
		}
	},

	formatBytes(bytes: number): string {
		return (bytes / 1024).toFixed(1);
	},

	calculateReduction(original: number, optimized: number): number {
		return parseFloat(((1 - optimized / original) * 100).toFixed(1));
	},

	fileExists(filePath: string): boolean {
		return fs.existsSync(filePath);
	},

	removeDirectory(dirPath: string): void {
		if (fs.existsSync(dirPath)) {
			fs.rmSync(dirPath, { recursive: true, force: true });
		}
	},

	copyDirectory(source: string, destination: string): void {
		fs.cpSync(source, destination, { recursive: true });
	}
};

// ============================================
// Exec Utilities
// ============================================

export const execUtils = {
	execute(command: string): string {
		try {
			return execSync(command, {
				encoding: 'utf-8',
				stdio: 'pipe'
			}).toString();
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(`Command failed: ${command}\n${error.message}`);
			}
			throw error;
		}
	},

	executeQuiet(command: string): boolean {
		try {
			execSync(command, { stdio: 'ignore' });
			return true;
		} catch {
			return false;
		}
	}
};
