require('dotenv').config();
const request = require('axios');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const { directusStart } = require('./fetch/utils');
const getHomePage = require('./fetch/getHomePage.js');
const getPages = require('./fetch/getPages.js');
const getTracks = require('./fetch/getTracks.js');

const getContent = (url) => {
  new Promise(async () => {
    const client = await directusStart(url);
    if (client) {
      const homePage = await getHomePage(client);
      const pages = await getPages(client, ['creative-commons']);
      const tracks = await getTracks(client);
      return homePage;
    }
    return null;
  });
  // getPages(['home', 'creative-commons']);
  // getTracks();
  // getPosts();
};

getContent(process.env.API);
