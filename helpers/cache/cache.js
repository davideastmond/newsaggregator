module.exports = {
  /** This function maps articles to an array of article urls.
   * @param {[]} cacheData An array of articles.
   * Normally, you supply the results from the memory cache into this parameter.
   * @return {[]} An array of article URLS
   */
  strip: (cacheData) => {
    if (cacheData) {
      return cacheData.map((obj) => {
        return obj.url;
      });
    }
  },


  contains: (cacheReference, emailString) => {
    // Returns
    const recoveryItems = cacheReference.get('prec');
    if (recoveryItems) {
      const filteredItems = recoveryItems.filter((item) => {
        return item.email === emailString;
      });

      if (filteredItems.length >= 1) {
        return true;
      }
    }
    return false;
  },

  write: (cacheReference, data) => {
    // First ge the catch
    try {
      const recoveryItems = cacheReference.get('prec'); // Should get an array of objects
      if (recoveryItems === null) {
        // Create new list
        const emptyItems = [];
        emptyItems.push(data);
        cacheReference.put('prec', emptyItems);
      } else {
        recoveryItems.push(data);
        cacheReference.put('prec', recoveryItems);
      }
    } catch (exception) {
      console.log('Please check your inputs:', exception);
    }
    // const checkFilter =
  },
};
