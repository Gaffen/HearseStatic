require("dotenv").config();
const request = require("axios");
const { URL } = require("url");
const fs = require("fs");
const path = require("path");

const getPages = require("./fetch/pages");
const getTracks = require("./fetch/tracks");

const getContent = (url) => {
  getPages(["home", "creative-commons"]);
  getTracks();
};

getContent(process.env.API);
