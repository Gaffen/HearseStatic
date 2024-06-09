const { Directus } = require('@directus/sdk');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const directusStart = async (url) => {
	const directus = new Directus(url);
	// let authenticated = false;
	// await directus.auth
	// 	.refresh()
	// 	.then(() => {
	// 		authenticated = true;
	// 	})
	// 	.catch(() => {});

	// const email = process.env.DIRECTUS_USER;
	// const password = process.env.DIRECTUS_PASSWORD;

	// await directus.auth
	// 	.login({ email, password })
	// 	.then(() => {
	// 		authenticated = true;
	// 	})
	// 	.catch(() => {
	// 		console.log('Auth failed!');
	// 	});

	return directus;
};

const writeMD = (data, destination, slug) => {
	if (!slug) {
		console.log('No slug provided!');
		return;
	}
	const contentDir =
		path.resolve(__dirname, '..', 'src', 'content') +
		(destination ? `/${destination}` : '');
	let output = '---\n';
	output += yaml.dump(data.frontmatter);
	output += '---\n';
	output += data.content ? data.content : '';

	// console.log(output);

	fs.writeFile(`${contentDir}/${slug}.md`, output, function (err) {
		if (err) {
			return console.log(err);
		}

		console.log(`Page "${data.frontmatter.title}" was saved!`);
	});
};

const getArchive = async (directus, pageSize, item, query, callback) => {
	let page = 0;
	let paging = true;
	let output = [];
	while (paging) {
		query.offset = page * pageSize;
		query.limit = pageSize;
		let { data } = await directus.items(item).readByQuery(query);
		if (data.length !== 0) {
			output = [...output, ...data];
			page += 1;
		} else {
			paging = false;
		}
	}
	callback(output);
};

module.exports = { directusStart, writeMD, getArchive };
