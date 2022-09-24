const { writeMD } = require('./utils');
const { getImgObj } = require('./imgMethods');
const yaml = require('js-yaml');

const getHomePage = async (directus) => {
  if (!directus) {
    return null;
  }
  let result = await directus.items('home_page').readByQuery({
    fields: [
      'bio_copy',
      'bio_headline',
      'dpk_link',
      'dpk_title',
      'bio_bg.id',
      'carousel.carousel_slide_id.*',
      'tracks.track_id.audio',
      'tracks.track_id.album_art',
      'tracks.track_id.title',
      'tracks.track_id.slug',
    ],
    deep: {
      carousel: {
        _sort: 'position',
      },
      tracks: {
        _sort: 'position',
      },
    },
  });
  let { data } = result;
  data.carousel = data.carousel.map(
    ({ carousel_slide_id: { image, portrait_image, ...item } }) => ({
      image: getImgObj(image, directus._url),
      portrait_image: getImgObj(portrait_image, directus._url),
      ...item,
    })
  );
  data.tracks = data.tracks.map(
    ({ track_id: { audio, album_art, title, slug } }) => ({
      audio: `${directus._url}/assets/${audio}`,
      album_art: getImgObj(album_art, directus._url, 'record'),
      title,
      slug,
    })
  );
  data.bio_bg = getImgObj(data.bio_bg.id, directus._url);
  data.title = 'Homepage';
  writeMD({ frontmatter: { layout: 'home.njk', ...data } }, '', 'index');
};

module.exports = getHomePage;
