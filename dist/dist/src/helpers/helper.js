"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var axiosHelpers = require('./fetchTopicHelper');
var duplicateArticlesHelper_1 = require("./duplicateArticlesHelper");
var fetchTopicHelper_1 = require("./fetchTopicHelper");
var bcrypt = require('bcryptjs');
/* This module consists of helper functions concerning password
validation and doing fetch requests to the API,
collating data etc */
/** Determines if password meet security and complexity requirements
 * @param {object} rawPassword
 * @return {boolean} Returns true if password meets requirements
 */
function passwordMeetsSecurityRequirements(rawPassword) {
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
    var regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/;
    return regEx.test(rawPassword.first);
}
exports.passwordMeetsSecurityRequirements = passwordMeetsSecurityRequirements;
/**
 * Synchornously hashes a password - mainly used for the db seeding
 * @function
 * @param {string} rawPassword
 * @return {string} returns a hashed string
 */
function hashPassword(rawPassword) {
    return bcrypt.hashSync(rawPassword, parseInt(process.env.SALT_ROUNDS));
}
exports.hashPassword = hashPassword;
/**
 * Uses bcryptjs to asynchronously hash a password string
 * @param {string} rawPassword
 * @return {Promise} Returns a promise
 */
function hashPasswordAsync(rawPassword) {
    return bcrypt.hash(rawPassword, parseInt(process.env.SALT_ROUNDS));
}
exports.hashPasswordAsync = hashPasswordAsync;
/** For each of the user topics, create a corresponding axios request
 * @function
 * @param AxiosFetchRequest data
 * @return {Promise}
 */
function doTopicsAxiosFetchRequest(data) {
    // Interpret all of the user's topics and request them from the newsAPI
    // Map the requests for a Promise.all
    return new Promise(function (resolve, reject) {
        var axiosQueries = data.userTopics.map(function (el) {
            return fetchTopicHelper_1.axiosFetchFromApiSingleTopic(el.name);
        });
        Promise.all(axiosQueries).then(function (resolvedData) {
            resolve(resolvedData);
        });
    });
}
exports.doTopicsAxiosFetchRequest = doTopicsAxiosFetchRequest;
/** Gathers all of the returned articles from the API fetch request
 * @param {array} fetchResults
 * @return {array}
 */
function compileAPIFetchData(fetchResults) {
    var dataArticles = fetchResults.map(function (el) {
        return el.data.articles.map(function (arts) {
            return arts;
        });
    });
    var filteredArray = duplicateArticlesHelper_1.getDuplicatesFromArticleArray(dataArticles);
    return filteredArray.filteredList;
}
exports.compileAPIFetchData = compileAPIFetchData;
/**
 * This is a server-side validation of an email address
 * @param {string} emailAddress
 * @return {boolean} Whether or not it matches the regular expression
 * E-mail address.
 */
function validateEmail(emailAddress) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailAddress);
}
exports.validateEmail = validateEmail;
