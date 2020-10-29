const _ = require('lodash/flattenDeep');
module.exports = {
  reduceAllSources: function (userWhiteList) {
    const baseSources = [];
    const sourceIds = userWhiteList.forEach((whiteListObject) => {
      baseSources.push(Array.from(new Set(whiteListObject.sourceIds)));
    })
    return _(baseSources);
  }
}
