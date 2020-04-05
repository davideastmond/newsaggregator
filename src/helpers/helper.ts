require('dotenv').config();
const axiosHelpers = require('./fetchTopicHelper');
import { getDuplicatesFromArticleArray } from './duplicateArticlesHelper'
import { axiosFetchFromApiSingleTopic } from './fetchTopicHelper'
const bcrypt = require('bcryptjs')
import { RawPassword, AxiosFetchRequest, NewsArticle } from './types/types'

/* This module consists of helper functions concerning password
validation and doing fetch requests to the API,
collating data etc */


/** Determines if password meet security and complexity requirements
 * @param {object} rawPassword
 * @return {boolean} Returns true if password meets requirements
 */
export function passwordMeetsSecurityRequirements (rawPassword: RawPassword): boolean {
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
}

/**
 * Synchornously hashes a password - mainly used for the db seeding
 * @function
 * @param {string} rawPassword
 * @return {string} returns a hashed string
 */
export function hashPassword(rawPassword: string): string {
  return bcrypt.hashSync(rawPassword, parseInt(process.env.SALT_ROUNDS));
}

/**
 * Uses bcryptjs to asynchronously hash a password string
 * @param {string} rawPassword
 * @return {Promise} Returns a promise
 */
export function hashPasswordAsync (rawPassword: string ): Promise<string> {
  return bcrypt.hash(rawPassword, parseInt(process.env.SALT_ROUNDS));
}

/** For each of the user topics, create a corresponding axios request
 * @function
 * @param AxiosFetchRequest data
 * @return {Promise}
 */
export function doTopicsAxiosFetchRequest(data: AxiosFetchRequest): Promise<any> {
  // Interpret all of the user's topics and request them from the newsAPI
  // Map the requests for a Promise.all
  return new Promise((resolve, reject) => {
    const axiosQueries = data.userTopics.map((el: any)=> {
      return axiosFetchFromApiSingleTopic(el.name);
    });

    Promise.all(axiosQueries).then((resolvedData) => {
      resolve(resolvedData);
    });
  });
}
/** Gathers all of the returned articles from the API fetch request
 * @param {array} fetchResults
 * @return {array}
 */
export function compileAPIFetchData (fetchResults: any): {} {
  const dataArticles = fetchResults.map((el: any) => {
    return el.data.articles.map((arts: any) => {
      return arts;
    });
  });
  const filteredArray = getDuplicatesFromArticleArray(dataArticles);
  return filteredArray.filteredList;
}

/**
 * This is a server-side validation of an email address
 * @param {string} emailAddress
 * @return {boolean} Whether or not it matches the regular expression
 * E-mail address.
 */
export function validateEmail(emailAddress: string): boolean {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailAddress);
}



