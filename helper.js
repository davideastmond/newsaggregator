const bcrypt = require('bcrypt');
const axios = require('axios');
const moment = require('moment');
require('dotenv').config();

// This module consists of helper functions concerning password validation and doing fetch requests to the API,
// collating data etc
module.exports = {
  
  /** Determines if password meet security and complexity requirements
   * @param {object} rawPassword
   * @param {string} rawPassword.first first of mandatory matching password
   * @param {string} rawPassword.second second of mandatory matching password
   * @returns {boolean} Returns true if password meets requirements
   */
  passwordMeetsSecurityRequirements: (rawPassword) => {
    // Password security verification: SERVER SIDE
    /* 
    - Make sure both supplied passwords are not null and match.
    - Make sure security and password complexity requirements are met
    */
    if (!rawPassword.first) {
      throw Error("1st password field is null.");
    }

    if (!rawPassword.second) {
      throw Error("2nd password field is null.");
    }
    
    if (rawPassword.first !== rawPassword.second) {
      return false;
    }

    const regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/;
    return regEx.test(rawPassword.first);
  },

  /**
   * Synchornously hashes a password - mainly used for the db seeding
   * @param {string} rawPassword 
   */
  hashPassword: function(rawPassword) {
    // This sync method is used for seeding the database
    return bcrypt.hashSync(rawPassword, parseInt(process.env.SALT_ROUNDS));
  },
  
  /**
   * Uses bcrypt to asynchronously hash a password string
   * @param {string} rawPassword
   * @returns {Promise} Returns a promise
   */
  hashPasswordAsync: function(rawPassword) {
    return bcrypt.hash(rawPassword, parseInt(process.env.SALT_ROUNDS));
  },
  
  /** For each of the user topics, create a corresponding axios request
   * @param {object} data
   * @returns {Promise}
   */
  doTopicsAxiosFetchRequest: (data)=> {
    // Interpret all of the user's topics and request them from the newsAPI
    // Map the requests for a Promise.all
    return new Promise((resolve, reject) => {
      const axios_queries = data.userTopics.map((el)=> {
        return axiosFetchFromApiSingleTopic(el.name);
      });

      Promise.all(axios_queries).then((resolved_data) => {
        resolve(resolved_data);
      });
    });
  },
  /** A function that coallates all of the API fetch requests
   * @param {array} fetchResults
   * @returns {array}
   */
  compileAPIFetchData: (fetchResults)=> {
    
    const dataArticles = fetchResults.map((el) => {
      return el.data.articles.map((arts) => {
        return arts;
      });
    });
    return dataArticles;
  },
  
  /**
   * For each news article, keep track of how many times the headline appears. That could signal there are duplicates 
   * @param {object} articleArrayData;
   */
  getDuplicatesFromArticleArray: (articleArrayData) => {
    let duplicateTracker = {};
    let filteredList = [];
    articleArrayData.forEach((article) => {
      if (!duplicateTracker[article.title]) {
        duplicateTracker[article.title] = 1;
        filteredList.push(article);
      } else {
        duplicateTracker[article.title] += 1;
      }
    });
    return filteredList;
  }
};

/** Returns the result from a single API request to the newsApi website
 * 
 * @param {string} str_topic 
 * @param {number} num_articles 
 * @returns {Promise} Returns an axios get request as a Promise
 */
function axiosFetchFromApiSingleTopic(str_topic, num_articles=10) {
  const grabDate = moment().format("MM/DD/YYYY");
  // TODO: Here is where we can determine how many articles to fetch based on the amount of topics
  const url = `https://newsapi.org/v2/everything?q=${str_topic}&from=${grabDate}&sortBy=publishedAt&apiKey=${process.env.PERSONAL_API_KEY}&pageSize=${num_articles}&language=en`;
  return axios.get(url);
}