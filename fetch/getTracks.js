const { getArchive, writeMD } = require('./utils');
const { getImgObj } = require('./imgMethods');

const getTracks = async (directus) => {
  if (!directus) {
    return null;
  }

  getArchive(
    directus,
    10,
    'track',
    {
      fields: [
        'title',
        'album_art.id',
        'audio.id',
        'slug',
        'lyrics',
        'purchase_link',
      ],
    },
    (data) => {
      const tracks = data.map(
        ({ lyrics, album_art, audio, slug, ...details }) => ({
          content: lyrics,
          frontmatter: {
            album_art: getImgObj(album_art.id, directus._url, 'trackPageArt'),
            audio: `${directus._url}/assets/${audio.id}`,
            layout: 'track.njk',
            ...details,
          },
          slug,
        })
      );
      tracks.forEach(({ slug, ...track }) => {
        writeMD(track, 'tracks', slug);
      });
      // tracks.map();
    }
  );
};

module.exports = getTracks;
