module.exports = {
  /** This function maps articles to an array of article urls.
   * @param {[]} cacheData An array of articles. Normally, you supply the results from the memory cache into this parameter.
   * @returns {[]} An array of article URLS
   */
  strip: (cacheData) => {
    if (cacheData) {
      return cacheData.map((obj) => {
        return obj.url;
      });
    }
  }
};