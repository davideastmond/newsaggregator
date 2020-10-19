const axios = require('axios');
const moment = require('moment');

module.exports = {
  /** Returns the result from a single API request to the newsApi website
 *
 * @param {string} strTopic
 * @param {number} numArticles
 * @return {Promise} Returns an axios get request as a Promise
 */
  axiosFetchFromApiSingleTopic: (strTopic, numArticles=30) => {
    const grabDate = moment().format('MM/DD/YYYY');
    // eslint-disable-next-line max-len
    const url = `https://newsapi.org/v2/everything?q=${strTopic}&from=${grabDate}&sortBy=publishedAt&apiKey=${process.env.PERSONAL_API_KEY}&pageSize=${numArticles}&language=en`;
    return axios.get(url);
  },
};
