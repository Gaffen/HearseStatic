const path = require("path");

module.exports = {
  modules: [
    path.join(__dirname, "../node_modules"),
    path.join(__dirname, "../src")
  ],
  extensions: [".json", ".js"],
  alias: {
    modernizr$: path.resolve(__dirname, "../.modernizrrc")
  }
};
