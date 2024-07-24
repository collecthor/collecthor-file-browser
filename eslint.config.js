import typescriptEslint from '@typescript-eslint/eslint-plugin';
import promise from 'eslint-plugin-promise';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import parser from 'svelte-eslint-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

export default tseslint.config(
	{
		ignores: [
			'**/*.cjs',
			'**/.DS_Store',
			'**/node_modules',
			'build',
			'browser',
			'.svelte-kit',
			'package',
			'dist',
			'**/.env',
			'**/.env.*',
			'!**/.env.example',
			'playwright-report',
			'.vscode',
			'.idea',
			'.github',
			'**/*.generated.d.ts',
			'**/.husky/',
			'**/.github/',
			'**/.stoplight/',
			'**/playwright.config.ts',
			'**/svelte.config.js',
			'**/vite.browser.js',
			'**/pnpm-lock.yaml',
			'**/package-lock.json',
			'**/yarn.lock'
		]
	},
	...compat.extends(
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
		'prettier'
	),
	{
		plugins: {
			'@typescript-eslint': typescriptEslint,
			promise
		},

		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			},

			parser: tsParser,
			ecmaVersion: 2020,
			sourceType: 'module',

			parserOptions: {
				project: 'tsconfig.json',
				extraFileExtensions: ['.svelte']
			}
		},

		rules: {
			'svelte/no-dupe-else-if-blocks': 'error',
			'svelte/button-has-type': 'error'
		}
	},
	{
		files: ['**/*.svelte'],

		languageOptions: {
			parser: parser,
			ecmaVersion: 5,
			sourceType: 'script',

			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	},
	{
		files: ['eslint.config.js'],
		extends: [tseslint.configs.disableTypeChecked]
	}
);
