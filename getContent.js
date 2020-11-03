require("dotenv").config();
const request = require("axios");
const { URL } = require("url");
const fs = require("fs");
const path = require("path");

const getPages = require("./fetch/pages");
const getTracks = require("./fetch/tracks");
const getPosts = require("./fetch/posts");

const getContent = (url) => {
  getPages(["home", "creative-commons"]);
  getTracks();
  getPosts();
};

getContent(process.env.API);
