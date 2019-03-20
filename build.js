const Metalsmith = require("metalsmith");
const json = require("metalsmith-jstransformer");
const layouts = require("metalsmith-layouts");
const fs = require("fs");
const markdown = require("metalsmith-markdown");
const collections = require("metalsmith-collections");
const msIf = require("metalsmith-if");
const msCopy = require("metalsmith-static");
const { URL } = require("url");
const request = require("axios");

const getContent = require("./getContent");
const mainURL = "https://api.gaffen.co.uk";
const apiURL = "/content/wp/v2/posts";
const url = `${mainURL}${apiURL}?_embed&per_page=100`;

Metalsmith(".")
  .use(msIf(process.env.GET_CONTENT, getContent(url)))
  .use(json())
  .metadata({ assets: require("./assets/manifest.json").main })
  .source("./src/content")
  .use(
    collections({
      posts: "posts/**.md"
    })
  )
  .use(
    layouts({
      directory: "./layouts",
      engine: "nunjucks",
      pattern: ["./posts/**/**.md", "**.md"],
      engineOptions: {
        autoescape: false
      }
    })
  )
  .use(markdown())
  .use(
    msCopy({
      src: "assets",
      dest: "assets"
    })
  )
  .use(
    msCopy({
      src: "src/fonts",
      dest: "fonts"
    })
  )
  .destination("./build")
  .build(err => {
    if (err) throw err;
    console.log("finished");
  });
