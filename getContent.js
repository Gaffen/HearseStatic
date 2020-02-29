const request = require("axios");
const { URL } = require("url");
const fs = require("fs");
const path = require("path");

const getContent = url => {
  const tracksDirectory = "./src/content/tracks";
  const pagesEndPoint = "/pages";
  const postsEndPoint = "/posts";
  const tracksEndPoint = "/track";

  // fs.readdir(tracksDirectory, (err, files) => {
  //   if (err) throw err;
  //
  //   for (const file of files) {
  //     if (file != ".gitkeep") {
  //       fs.unlink(path.join(tracksDirectory, file), err => {
  //         if (err) throw err;
  //       });
  //     }
  //   }
  // });


  request
    .get(`${url}${pagesEndPoint}?_embed&slug[]=home&slug[]=creative-commons`)
    .then(res => {
      data = {};

      res.data.forEach((item, i) => {

        if(item.slug == "home"){
          item.layout = "home.njk";
          item.slug = "index";
        }

        if(item.slug == "creative-commons"){
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
        value += JSON.stringify(item) + '\n';
        value += "---";
        value += content;

        fs.writeFile(`./src/content/${item.slug}.md`, value, function(
          err
        ) {
          if (err) {
            return console.log(err);
          }

          console.log(`Page "${item.title}" was saved!`);
        });
      });

    });

  request
    .get(`${url}${tracksEndPoint}?_embed&per_page=100`)
    .then(res => {
      const noPages = res.headers["x-wp-totalpages"];
      const pagesToFetch = new Array(noPages - 1)
        .fill(0)
        .map((el, id) => request.get(`${url}&page=${id + 2}`));
      return Promise.all([res, ...pagesToFetch]);
    })
    .then(results => Promise.all(results.map(el => el.data)))
    .then(pages => {
      return [].concat(...pages);
    })
    .then(allTracks => {
      allTracks.forEach(track => {
  //       console.log();
        const key = `./tracks/${track.slug}/index.html`;
        track.title = track.title.rendered;
        const content = track.content.rendered;
        delete track.content;
        track.layout = "track.njk";

        let value = "---json\n";
        value += JSON.stringify(track) + '\n';
        value += "---";
        value += content;
        fs.writeFile(`./src/content/tracks/${track.slug}.md`, value, function(
          err
        ) {
          if (err) {
            return console.log(err);
          }

          console.log(`The track "${track.title}" was saved!`);
        });
      });
      // done();
    });
};

const mainURL = "https://api.hearsepileup.rip";
const apiURL = "/wp-json/wp/v2";

getContent(`${mainURL}${apiURL}`);
