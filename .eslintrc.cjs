module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
		'prettier'
	],
	plugins: ['@typescript-eslint', 'promise'],
	ignorePatterns: ['*.cjs'],
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	],
	parserOptions: {
		sourceType: 'module',
		project: 'tsconfig.json',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	rules: {
		'svelte/no-dupe-else-if-blocks': 'error',
		'svelte/button-has-type': 'error'
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	}
};
