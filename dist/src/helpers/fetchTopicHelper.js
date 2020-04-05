"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios = require('axios');
var moment = require('moment');
/** Returns the result from a single API request to the newsApi website
 *
 * @param {string} strTopic
 * @param {number} numArticles
 * @return {Promise} Returns an axios get request as a Promise
 */
function axiosFetchFromApiSingleTopic(strTopic, numArticles) {
    if (numArticles === void 0) { numArticles = 30; }
    var grabDate = moment().format('MM/DD/YYYY');
    // eslint-disable-next-line max-len
    var url = "https://newsapi.org/v2/everything?q=" + strTopic + "&from=" + grabDate + "&sortBy=publishedAt&apiKey=" + process.env.PERSONAL_API_KEY + "&pageSize=" + numArticles + "&language=en";
    return axios.get(url);
}
exports.axiosFetchFromApiSingleTopic = axiosFetchFromApiSingleTopic;
