const path = require("path");
const fs = require("fs");
const Nunjucks = require("nunjucks");

const vueTag = require("./njktags/vue");

// const requireFromString = function(src, filename) {
//   console.log(src);
//   requireFromString(filename, src);
//   return requireFromString(filename);
// };

module.exports = function(eleventyConfig) {

  let nunjucksEnvironment = new Nunjucks.Environment(
    new Nunjucks.FileSystemLoader("layouts")
  );

  eleventyConfig.setLibrary("njk", nunjucksEnvironment);

  // Install custom tag
  eleventyConfig.addNunjucksTag("vue", function(nunjucksEngine) {
    return new vueTag(nunjucksEngine);
  });

  eleventyConfig.addNunjucksFilter("debug", function(value) {
    console.log(value);
    return `<pre>${value ? JSON.stringify(value) : "Variable undefined"}</pre>`;
  });
  eleventyConfig.addCollection("tracks", collection => {
    let tracks = collection.getFilteredByGlob("src/content/tracks/*.md");
    return tracks;
  });


  return {
    dir: {
      input: "src/content",
      output: "build",
      includes: "../../layouts",
      data: "../../data"
    },
    templateFormats: ["md", "njk"],
    passthroughFileCopy: false
  };
};
