const request = require("axios");
const { URL } = require("url");
const fs = require("fs");
const path = require("path");

const getContent = url => {
  const directory = "./src/content/posts";

  // fs.readdir(directory, (err, files) => {
  //   if (err) throw err;
  //
  //   for (const file of files) {
  //     if (file != ".gitkeep") {
  //       fs.unlink(path.join(directory, file), err => {
  //         if (err) throw err;
  //       });
  //     }
  //   }
  // });
  //

  request
    .get(url)
    .then(res => {
      data = {};

      res.data.forEach((item, i) => {

        if(item.slug == "home"){
          item.layout = "holding.njk";
          item.slug = "index";
        }

        delete item.collection;
        delete item.featured_media;
        delete item.parent;
        delete item.menu_order;

        let value = "---json\n";
        value += JSON.stringify(item) + '\n';
        value += "---";



        fs.writeFile(`./src/content/${item.slug}.md`, value, function(
          err
        ) {
          if (err) {
            return console.log(err);
          }

          console.log(`"${item.title.rendered}" was saved!`);
        });
      });

    });

  // request
  //   .get(url)
  //   .then(res => {
  //     const noPages = res.headers["x-wp-totalpages"];
  //     const pagesToFetch = new Array(noPages - 1)
  //       .fill(0)
  //       .map((el, id) => request.get(`${url}&page=${id + 2}`));
  //     return Promise.all([res, ...pagesToFetch]);
  //   })
  //   .then(results => Promise.all(results.map(el => el.data)))
  //   .then(pages => {
  //     return [].concat(...pages);
  //   })
  //   .then(allPosts => {
  //     allPosts.forEach(post => {
  //       console.log();
  //       const key = `./posts/${post.slug}/index.html`;
  //       let frontmatter = {
  //         layout: "post.njk",
  //         title: post.title.rendered,
  //         date: post.date,
  //         collection: "post"
  //       };
  //       const frontmatterKeys = Object.keys(frontmatter);
  //       let value = "---\n";
  //       value += `${frontmatterKeys
  //         .map(key => `${key}: ${frontmatter[key]}\n`)
  //         .join("")}`;
  //       value += "---\n";
  //       value += post.content.rendered;
  //
  //       fs.writeFile(`./src/content/posts/${post.slug}.md`, value, function(
  //         err
  //       ) {
  //         if (err) {
  //           return console.log(err);
  //         }
  //
  //         console.log(`"${post.title.rendered}" was saved!`);
  //       });
  //     });
  //     // done();
  //   });
};

const mainURL = "https://api.hearsepileup.rip";
const apiURL = "/wp-json/wp/v2/pages";
const url = `${mainURL}${apiURL}?_embed&slug=home`;

getContent(url);
