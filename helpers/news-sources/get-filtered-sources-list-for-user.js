const mockUserData = require('./mock-user-news-source-data');
const mockMasterSources = require('./mock-master-sources.json');
const { reduceAllSources } = require('./reduce-all-sources');

module.exports = {
  /**
   * @param {boolean} byTopic Whether or not to take into account news source by topic
   * @param {{}} masterSourcesObject the raw list fetched from API
   * @param {{}} userSources the object from mongodb
   */
  getFilteredSourcesList: (byTopic, mSourcesArray, uWhiteListArray) => {
    if (byTopic === undefined || byTopic === false) {
      // First get a flattened whiteList of domains
      const reducedSources = reduceAllSources(uWhiteListArray)
      const mappedSources = mSourcesArray.map((source) => {
        if (reducedSources.includes(source.id)) {
          return {
            ...source,
            checked: true,
          }
        } else {
          return {
            ...source,
            checked: false,
          }
        }
      })
      return { mappedSources, byTopic: false };
    } else {
      throw new Error("Feature not yet implemented");
    }
  }
}
