const Vue = require("vue");
const path = require("path");
const TemplateCompiler = require("vue-template-compiler");
const VueServerRenderer = require("vue-server-renderer");
const VueCompilerUtils = require("@vue/component-compiler-utils");
const fs = require("fs");
const dynamicImports = require("dynamic-imports");
const requireFromString = require("require-from-string");
const babel = require("@babel/core");
const manifest = require("./data/manifest.json");

// const requireFromString = function(src, filename) {
//   console.log(src);
//   requireFromString(filename, src);
//   return requireFromString(filename);
// };

module.exports = function(eleventyConfig) {
  eleventyConfig.addNunjucksTag("vue", function(nunjucksEngine) {
    return new function() {
      this.tags = ["vue"];

      this.parse = function(parser, nodes, lexer) {
        let tok = parser.nextToken();

        let args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);

        return new nodes.CallExtensionAsync(this, "run", args);
      };

      this.run = function(context, args, callback) {
        const parsedComponent = TemplateCompiler.parseComponent(
          fs.readFileSync(
            path.join(
              __dirname,
              "src",
              "js",
              "components",
              `${args.component}.vue`
            ),
            "utf8"
          )
        );

        const moduleScript = requireFromString(
          babel.transformSync(parsedComponent.script.content, {
            presets: [["@babel/env", { modules: false, loose: true }]],
            plugins: ["@babel/plugin-transform-modules-commonjs"]
          }).code
        ).default;

        const renderer = VueServerRenderer.createRenderer({
          template: `<div><!--vue-ssr-outlet--></div>`
        });

        moduleScript.template = parsedComponent.template.content;

        if (manifest.vue[args.component]) {
          moduleScript._scopeId = `data-v-${manifest.vue[args.component]}`;
        }

        console.log(moduleScript);

        let component = Vue.component(args.component, moduleScript);
        console.log(component);
        let props = "";
        if (args.props) {
          props = " ";
          Object.keys(args.props).forEach(e => {
            props += `${e}="${args.props[e]}"`;
          });
        }

        renderer.renderToString(
          new Vue({
            template: `<${args.component}${props}></${args.component}>`
          }),
          (err, result) => {
            if (!err) {
              callback(null, new nunjucksEngine.runtime.SafeString(result));
            } else {
              callback(null, "Component render failed");
            }
          }
        );
      };
    }();
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
