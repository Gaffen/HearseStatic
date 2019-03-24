module.exports = {
  dir: {
    input: "src/content",
    output: "build",
    includes: "../../layouts",
    data: "../../data"
  },
  templateFormats: ["md", "njk"],
  passthroughFileCopy: false
};
