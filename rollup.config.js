import commonjs from '@rollup/plugin-commonjs';
const svelte = require('rollup-plugin-svelte');

export default [
	// browser-friendly UMD build
	{
		input: 'src/js/rolluptest.js',
		output: {
			name: 'rolluptest',
			file: 'build/assets/rolluptest.js',
			format: 'umd',
		},
		plugins: [
			commonjs(), // so Rollup can convert `ms` to an ES module
		],
	},
];
