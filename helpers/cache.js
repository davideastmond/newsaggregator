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


  isAlreadyInCache: (cacheReference, emailString)=> {
    // Returns
    const recoveryItems = cacheReference.get('prec');

    return false;
  },
  writeToCatch: (cacheReference, data) =>{
    // First ge the catch
    const recoveryItems = cacheReference.get('prec'); // Should get an array of objects
    if (recoveryItems === null) {
      // Create new list
      const emptyItems = [];
      emptyItems.push(data);
      cacheReference.put('prec', emptyItems);
    } else {

    }
    // const checkFilter =
  },
};
