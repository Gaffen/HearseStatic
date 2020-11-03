const request = require("axios");
const fs = require("fs");
const archiveFetch = require("./archiveFetch");

module.exports = function() {
  const { API, POSTS_ENDPOINT } = process.env;
  archiveFetch(POSTS_ENDPOINT, function(post) {
    const slug = post.slug.length > 0 ? post.slug : post.id;
    const key = `./posts/${slug}/index.html`;
    let tags = [];
    post._embedded["wp:term"].forEach((term) => {
      if (term[0]) {
        tags.push(term[0].name);
      }
    });
    if (post.meta.title) {
      post.title.rendered = post.meta.title.innerHTML;
    }
    const template =
      post.template != "" ? `${post.template}.njk` : "default.njk";
    let frontmatter = {
      layout: `posts/${template}`,
      title: post.title.rendered,
      date: post.date,
      tags: JSON.stringify(tags),
      excerpt: post.excerpt.rendered,
      templateEngineOverride: "md",
    };
    const frontmatterKeys = Object.keys(frontmatter);
    let value = "---\n";
    value += `${frontmatterKeys
      .map((key) => `${key}: ${frontmatter[key]}\n`)
      .join("")}`;
    value += "---\n";
    value += post.content.rendered;

    return {
      output: value,
      writePath: `blog/${post.slug}.md`,
      title: post.title.rendered,
    };
  });
};
