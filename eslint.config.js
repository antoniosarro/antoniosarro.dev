import prettier from 'eslint-config-prettier';
import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	{
		ignores: ['build/**', '.svelte-kit/**', 'node_modules/**', 'static/**', '*.min.js']
	},
	js.configs.recommended,
	...ts.configs.recommendedTypeChecked,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
			parserOptions: {
				projectService: true,
				tsconfigRootDir: fileURLToPath(new URL('.', import.meta.url))
			}
		},
		rules: {
			'no-undef': 'off',
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			'prefer-const': 'error',
			'no-var': 'error',
			eqeqeq: ['error', 'always', { null: 'ignore' }],
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
				{ prefer: 'type-imports', fixStyle: 'inline-type-imports' }
			],
			'@typescript-eslint/no-import-type-side-effects': 'error',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-floating-promises': 'error',
			'@typescript-eslint/await-thenable': 'error'
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		},
		rules: {
			'svelte/no-at-html-tags': 'off',
			'svelte/valid-compile': ['error', { ignoreWarnings: false }],
			'svelte/no-unused-svelte-ignore': 'error',
			'svelte/spaced-html-comment': 'error',
			'svelte/no-reactive-reassign': 'warn'
		}
	},
	{
		files: ['scripts/**/*.ts', 'scripts/**/*.mjs'],
		rules: {
			'no-console': 'off'
		}
	},
	{
		files: ['**/*.config.js', '**/*.config.ts'],
		rules: {
			'@typescript-eslint/no-require-imports': 'off'
		}
	}
);
