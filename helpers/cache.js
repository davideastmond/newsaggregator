const cache = require('memory-cache');

/**
 * @param {object} cacheData an instance of the cache (from memory-cache)
 * @param {[]} dataArray the results of a database query
 */
module.exports = {
  strip: (cacheData) => {
    if (cacheData) {
      const strippedData = cacheData.map((obj) => {
        return obj.url;
      });
      return strippedData;
    }
  }
};