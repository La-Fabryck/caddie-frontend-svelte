import { defineConfig } from 'oxfmt';

export default defineConfig({
	ignorePatterns: ['static/**', '.svelte-kit/**', 'build/**', 'dist/**', 'coverage/**'],
	printWidth: 100,
	singleQuote: true,
	sortImports: {
		groups: [
			['type-builtin', 'value-builtin'],
			['type-external', 'value-external'],
			['type-internal', 'value-internal'],
			['type-parent', 'type-sibling', 'type-index', 'value-parent', 'value-sibling', 'value-index'],
			'unknown',
		],
		internalPattern: ['@/', 'test/'],
		newlinesBetween: false,
	},
	sortPackageJson: true,
	sortTailwindcss: {
		functions: ['clsx', 'cn'],
		stylesheet: './src/app.css',
	},
	svelte: true,
	trailingComma: 'all',
	useTabs: true,
});
