const request = require("axios");
const fs = require("fs");

module.exports = function(endpoint, formatCallback) {
  const { API } = process.env;
  request
    .get(`${API}${endpoint}?_embed&per_page=100`)
    .then((res) => {
      const noPages = res.headers["x-wp-totalpages"];
      const pagesToFetch = new Array(noPages - 1)
        .fill(0)
        .map((el, id) => request.get(`${url}&page=${id + 2}`));
      return Promise.all([res, ...pagesToFetch]);
    })
    .then((results) => Promise.all(results.map((el) => el.data)))
    .then((pages) => {
      return [].concat(...pages);
    })
    .then((allItems) => {
      allItems.forEach((item) => {
        let { output, writePath, title } = formatCallback(item);

        fs.writeFile(`./src/content/${writePath}`, output, function(err) {
          if (err) {
            return console.log(err);
          }

          console.log(`The track "${title}" was saved!`);
        });
      });
      // done();
    });
};
