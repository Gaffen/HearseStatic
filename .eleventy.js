const path = require('path');
const fs = require('fs');
const { EleventyRenderPlugin } = require('@11ty/eleventy');
const Nunjucks = require('nunjucks');

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
    return markdown.render(value);
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
