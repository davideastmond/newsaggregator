module.exports = {
  /**
   * For each news article, keep track of how many times the headline appears.
   * That could signal there are duplicates
   * @param {object} articleArrayData;
   * @return {[]}
   */
  getDuplicatesFromArticleArray: (articleArrayData) => {
    const duplicateTracker = {};
    const filteredList = [];
    articleArrayData.forEach((article) => {
      if (!duplicateTracker[article.title]) {
        duplicateTracker[article.title] = 1;
        filteredList.push(article);
      } else {
        duplicateTracker[article.title] += 1;
      }
    });
    // A test would ensure that no duplicate headlines are in the array
    return { filteredList: filteredList,
      test: filteredList.length === articleArrayData.length };
  },
};
