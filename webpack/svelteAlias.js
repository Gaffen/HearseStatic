const path = require('path');
const rootdir = path.resolve(path.dirname(__filename) + '/..');

/**
 * A list of alias's that can be fed into the vite configuration
 * and can be used by the importer function below
 */
const alias_webpack_setts = {
  '/@': path.resolve(rootdir),
  '~': path.resolve(rootdir + '/node_modules'),
  '@styles': path.resolve(rootdir + '/src/scss'),
};
exports.alias_webpack_setts = alias_webpack_setts;

/**
 * An importer function that we can pass to svelte-preprocess
 */
exports.alias_webpack_importer = () => {
  return (url) => {
    // Sort the entries by longest first, so @style2 would be picked up before @style
    let entries = Object.entries(alias_webpack_setts).sort(
      ([, a]) => -a.length
    );
    // Iterate over the alias entries
    for (const [alias, aliasPath] of entries) {
      if (url.indexOf(alias) === 0) {
        return {
          file: path.resolve(url.replace(alias, aliasPath)),
        };
      }
    }
    return url;
  };
};
