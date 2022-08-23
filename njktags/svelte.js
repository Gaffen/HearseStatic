const register = require('svelte/register');
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const MemoryFs = require('memory-fs');
const requireFromString = require('require-from-string');
const svelte = require('svelte/compiler');

const webpackConfig = require('../webpack/svelte');

function renderComponent(component, filename, props) {
	// svelte.parse(component);
	return `
<div
	class="svelte--${filename}"
	data-props='${JSON.stringify(props || {})}'
>
	${component.render(props || {}).html}
</div>
`;
}

module.exports = async function svelteShortcode(filename, rawProps = {}) {
	const input = path.join(
		process.cwd(),
		'src',
		'js',
		'svelte',
		filename,
		'index.svelte'
	);

	const props = {};
	Object.keys(rawProps).forEach((key) => {
		if (typeof rawProps[key] === 'object' && rawProps.constructor === Object) {
			props[key] = JSON.stringify(rawProps[key]);
		} else {
			props[key] = rawProps[key];
		}
	});

	const config = webpackConfig(input);

	const compiler = webpack(config);
	compiler.outputFileSystem = new MemoryFs();

	const build = await new Promise((resolve, reject) => {
		compiler.run((err, stats) => {
			if (err) return reject(err);

			if (stats.hasErrors() || stats.hasWarnings()) {
				return reject(
					new Error(
						stats.toString({
							errorDetails: true,
							warnings: true,
						})
					)
				);
			}

			const result = compiler.outputFileSystem.data['bundle.js'].toString();
			resolve({ result, stats });
		});
	}).then((e) => {
		return e;
	});

	const Component = requireFromString(build.result).default;
	return renderComponent(Component, filename, props);
};
