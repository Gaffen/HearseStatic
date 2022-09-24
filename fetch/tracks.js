const request = require('axios');
const fs = require('fs');
const archiveFetch = require('./archiveFetch');

module.exports = function () {
  const { API, TRACKS_ENDPOINT } = process.env;
  archiveFetch(TRACKS_ENDPOINT, function (track) {
    const key = `./tracks/${track.slug}/index.html`;
    track.title = track.title.rendered;
    const content = track.content.rendered;
    delete track.content;
    track.layout = 'track.njk';

    let value = '---json\n';
    value += JSON.stringify(track) + '\n';
    value += '---';
    value += content;

    return {
      output: value,
      writePath: `tracks/${track.slug}.md`,
      title: track.title,
    };
  });
};
