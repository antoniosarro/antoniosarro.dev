import svelteParser from 'svelte-eslint-parser';

import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

export default tsEslint.config(
	js.configs.recommended,
	...tsEslint.configs.recommendedTypeChecked,

	// Import sorting
	{
		plugins: {
			'simple-import-sort': simpleImportSort
		},
		rules: {
			'simple-import-sort/imports': [
				'error',
				{
					groups: [
						// Side effect imports
						['^\\u0000'],
						// Svelte and framework imports
						['^svelte', '^@sveltejs'],
						// Icon imports
						['^~icons/'],
						// $app and $env imports
						['^\\$app', '^\\$env'],
						// $lib imports
						['^\\$lib'],
						// Parent imports
						['^\\.\\.'],
						// Current directory imports
						['^\\.'],
						// Type imports
						['^.*\\u0000$']
					]
				}
			],
			'simple-import-sort/exports': 'error'
		}
	},

	// TypeScript files
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: tsEslint.parser,
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname
			}
		},
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_'
				}
			],
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{
					prefer: 'type-imports',
					fixStyle: 'inline-type-imports'
				}
			],
			'@typescript-eslint/no-import-type-side-effects': 'error'
		}
	},

	// JavaScript config files
	{
		files: ['**/*.js', '**/*.cjs', '**/*.mjs', '**/*.config.ts'],
		...tsEslint.configs.disableTypeChecked
	},

	// Svelte files
	...eslintPluginSvelte.configs['flat/recommended'],
	...eslintPluginSvelte.configs['flat/prettier'],
	{
		name: 'svelte',
		files: ['**/*.svelte', '**/*.svelte.*'],
		// ...,
		rules: {
			// @see https://github.com/sveltejs/eslint-plugin-svelte/issues/1353
			'svelte/no-navigation-without-resolve': 'off'
			// ...,
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			globals: {
				...globals.browser
			},
			ecmaVersion: 2024,
			sourceType: 'module',
			parser: svelteParser,
			parserOptions: {
				parser: tsEslint.parser,
				extraFileExtensions: ['.svelte'],
				project: ['tsconfig.json', '.svelte-kit/tsconfig.json'],
				tsconfigRootDir: import.meta.dirname
			}
		},
		rules: {
			// Svelte 5 specific rules
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					varsIgnorePattern: '^\\$\\$(Props|Events|Slots|Generic)|^_',
					argsIgnorePattern: '^_'
				}
			],
			// Accessibility
			'svelte/valid-compile': 'error',
			'svelte/no-at-html-tags': 'warn',
			'svelte/require-each-key': 'error',
			'svelte/no-reactive-reassign': 'error',
			// Svelte 5 runes
			'svelte/valid-prop-names-in-kit-pages': 'error',
			// No unused $state, $derived, etc.
			'svelte/no-unused-svelte-ignore': 'error'
		}
	},

	// Server-side files
	{
		files: ['**/*.server.ts', '**/*.server.js', '**/+server.ts'],
		languageOptions: {
			globals: {
				...globals.node
			}
		}
	},

	// Test files
	{
		files: ['tests/**/*.ts', '**/*.test.ts', '**/*.spec.ts'],
		rules: {
			'no-empty-pattern': ['error', { allowObjectPatternsAsParameters: true }],
			'@typescript-eslint/no-explicit-any': 'off'
		}
	},

	// Ignores
	{
		ignores: [
			'.svelte-kit',
			'.vercel',
			'.github',
			'.storybook',
			'.vscode',
			'build',
			'static',
			'package',
			'coverage',
			'node_modules',
			'scripts/**/*.mjs' // Generated scripts
		]
	},

	eslintConfigPrettier
);
