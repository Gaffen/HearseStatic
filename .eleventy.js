const path = require('path');
const fs = require('fs');
const { EleventyRenderPlugin } = require('@11ty/eleventy');
const Nunjucks = require('nunjucks');
const { DateTime } = require('luxon');

const vueTag = require('./njktags/vue');
const svelteTag = require('./njktags/svelte');

module.exports = function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);

  let nunjucksEnvironment = new Nunjucks.Environment(
    new Nunjucks.FileSystemLoader('layouts')
  );

  eleventyConfig.addFilter('markdown', function (value) {
    let markdown = require('markdown-it')({
      html: true,
    });
    const output = markdown.render(value);
    return output;
  });

  eleventyConfig.addFilter('asGigDate', function (date) {
    return DateTime.fromISO(date, {
      zone: 'Europe/London',
    }).toLocaleString(DateTime.DATE_SHORT);
  });

  eleventyConfig.addFilter('osmLink', function (coords) {
    return `https://www.openstreetmap.org/?mlat=${coords[1]}&mlon=${coords[0]}#map=19/${coords[1]}/${coords[0]}`;
  });

  eleventyConfig.addPlugin(EleventyRenderPlugin);

  eleventyConfig.setLibrary('njk', nunjucksEnvironment);

  // Install custom tag
  eleventyConfig.addNunjucksTag('vue', function (nunjucksEngine) {
    return new vueTag(nunjucksEngine);
  });

  eleventyConfig.addNunjucksAsyncShortcode('svelte', (e, f) => {
    return svelteTag(e, f);
  });

  eleventyConfig.addNunjucksFilter('debug', function (value) {
    console.log(value);
    return `<pre>${value ? JSON.stringify(value) : 'Variable undefined'}</pre>`;
  });
  eleventyConfig.addCollection('tracks', (collection) => {
    let tracks = collection.getFilteredByGlob('src/content/tracks/*.md');
    return tracks;
  });

  return {
    dir: {
      input: 'src/content',
      output: 'build',
      includes: '../../layouts',
      data: '../../data',
    },
    templateFormats: ['md', 'njk'],
    passthroughFileCopy: false,
  };
};
