const svgstore = require("svgstore");
const fs = require("fs");
const path = require("path");

const genSVG = () => {
  const sprites = svgstore({
    cleanDefs: true,
    cleanSymbols: true,
    symbolAttrs: { fill: null }
  });

  const srcDir = path.resolve(__dirname, "src", "svg");

  fs.readdir(srcDir, (err, files) => {
    if (err) {
      return console.error("Unable to read directory");
    }

    files.forEach(file => {
      sprites.add(
        file.split(".")[0],
        fs.readFileSync(`${srcDir}/${file}`, { encoding: "utf-8" })
      );
    });

    fs.writeFileSync(
      path.resolve(__dirname, "layouts", "partials", "sprite.svg"),
      sprites
    );
  });
};

return genSVG();
