const { writeMD } = require('./utils');

const getPages = async (directus, slugs) => {
  if (!directus) {
    return null;
  }
  let { data } = await directus.items('page').readByQuery({
    fields: ['content', 'title', 'layout', 'page_slug'],
    filter: {
      page_slug: { _in: slugs },
    },
  });

  if (data.length > 0) {
    data.forEach(({ page_slug, content, ...page }) => {
      writeMD({ frontmatter: page, content }, '', page_slug);
    });
  }
  return data;
};

module.exports = getPages;
