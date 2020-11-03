const request = require("axios");
const fs = require("fs");

module.exports = function(slugs) {
  const { API, PAGES_ENDPOINT } = process.env;
  request
    .get(
      `${API}${PAGES_ENDPOINT}?_embed${slugs.map((slug) => `&slug[]=${slug}`)}`
    )
    .then((res) => {
      data = {};

      res.data.forEach((item, i) => {
        if (item.slug == "home") {
          item.layout = "home.njk";
          item.slug = "index";
        }

        if (item.slug == "creative-commons") {
          item.layout = "lightbox.njk";
        }

        delete item.collection;
        delete item.featured_media;
        delete item.parent;
        delete item.menu_order;

        // console.log(item.content);

        item.title = item.title.rendered;
        const content = item.content.rendered;
        delete item.content;

        let value = "---json\n";
        value += JSON.stringify(item) + "\n";
        value += "---";
        value += content;

        fs.writeFile(`./src/content/${item.slug}.md`, value, function(err) {
          if (err) {
            return console.log(err);
          }

          console.log(`Page "${item.title}" was saved!`);
        });
      });
    });
};
