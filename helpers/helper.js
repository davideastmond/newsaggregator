require('dotenv').config();
const axiosHelpers = require('./fetchTopicHelper');
const duplicatesHelper = require('./duplicateArticlesHelper');

/* This module consists of helper functions concerning password
  validation and doing fetch requests to the API,
  collating data etc */
module.exports = {

  /** Determines if password meet security and complexity requirements
   * @param {object} rawPassword
   * @param {string} rawPassword.first first of mandatory matching password
   * @param {string} rawPassword.second second of mandatory matching password
   * @return {boolean} Returns true if password meets requirements
   */
  passwordMeetsSecurityRequirements: (rawPassword) => {
    // Password security verification: SERVER SIDE
    /*
    - Make sure both supplied passwords are not null and match.
    - Make sure security and password complexity requirements are met
    */
    if (!rawPassword.first) {
      throw Error('1st password field is null.');
    }

    if (!rawPassword.second) {
      throw Error('2nd password field is null.');
    }

    if (rawPassword.first !== rawPassword.second) {
      return false;
    }

    const regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/;
    return regEx.test(rawPassword.first);
  },

  /**
   * Synchornously hashes a password - mainly used for the db seeding
   * @function
   * @param {string} rawPassword
   * @return {string} returns a hashed string
   */
  hashPassword: function(rawPassword) {
    // This sync method is used for seeding the database
    const bcrypt = require('bcryptjs');
    return bcrypt.hashSync(rawPassword, parseInt(process.env.SALT_ROUNDS));
  },

  /**
   * Uses bcryptjs to asynchronously hash a password string
   * @param {string} rawPassword
   * @return {Promise} Returns a promise
   */
  hashPasswordAsync: function(rawPassword) {
    const bcrypt = require('bcryptjs');
    return bcrypt.hash(rawPassword, parseInt(process.env.SALT_ROUNDS));
  },

  /** For each of the user topics, create a corresponding axios request
   * @function
   * @param {object} data
   * @return {Promise}
   */
  doTopicsAxiosFetchRequest: (data)=> {
    // Interpret all of the user's topics and request them from the newsAPI
    // Map the requests for a Promise.all
    return new Promise((resolve, reject) => {
      const axiosQueries = data.userTopics.map((el)=> {
        return axiosHelpers.axiosFetchFromApiSingleTopic(el.name);
      });

      Promise.all(axiosQueries).then((resolvedData) => {
        resolve(resolvedData);
      });
    });
  },
  /** Gathers all of the returned articles from the API fetch request
   * @function
   * @param {array} fetchResults
   * @return {array}
   */
  compileAPIFetchData: (fetchResults)=> {
    const dataArticles = fetchResults.map((el) => {
      return el.data.articles.map((arts) => {
        return arts;
      });
    });
    const filteredArray = duplicatesHelper.getDuplicatesFromArticleArray(dataArticles);
    return filteredArray.filteredList;
  },

  /**
     * This is a server-side validation of an email address
     * @param {string} emailAddress
     * @return {boolean} Whether or not it matches the regular expression
     * E-mail address.
     */
  validateEmail: (emailAddress) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailAddress);
  },
};


