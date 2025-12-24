// prettier.config.js
/** @type {import('prettier').Config} */
const config = {
	useTabs: true,
	tabWidth: 2,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 80,
	bracketSameLine: true,
	singleAttributePerLine: false,
	htmlWhitespaceSensitivity: 'ignore',

	plugins: ['prettier-plugin-svelte', 'prettier-plugin-tailwindcss'],

	overrides: [
		{
			files: '*.svelte',
			options: {
				parser: 'svelte',
				svelteStrictMode: false,
				svelteIndentScriptAndStyle: true,
				svelteSortOrder: 'options-scripts-markup-styles'
			}
		},
		{
			files: ['*.md', '*.mdx'],
			options: {
				proseWrap: 'always',
				printWidth: 100
			}
		},
		{
			files: '*.json',
			options: {
				tabWidth: 2,
				useTabs: false
			}
		}
	]
};

export default config;
