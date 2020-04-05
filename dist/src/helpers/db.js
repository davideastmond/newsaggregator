"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dbConnectString = require('../../knexfile');
var knex = require('knex')(dbConnectString.development);
var crypto = require('./crypto');
var helperFunctions = require('./helper');
/** Registers the user into the system.
 * Ensures no duplicate accounts. Checks to see
 * if the password meets security requirements.
 * Hashes the password and creates a new record.
 * @param {object} registrationData contains email + passwords for verification
 * @param {string} registrationData.email Unique e-mail address
 * @param {string} registrationData.first_password matching passwords
 * @param {string} registrationData.second_password matching passwords
 * @return {Promise<{}>} A Promise containing an object
 * or an error message if fail.
 */
function registerUser(registrationData) {
    return __awaiter(this, void 0, void 0, function () {
        var hashedPassword, result, error_1, displayMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // First check to see if password meets security requirements
                    if (!helperFunctions
                        .passwordMeetsSecurityRequirements({ first: registrationData.first_password,
                        second: registrationData.second_password })) {
                        return [2 /*return*/, Promise.reject(new Error('Password does not meet security requirements'))];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, crypto
                            .hashPassword((registrationData.first_password))];
                case 2:
                    hashedPassword = _a.sent();
                    return [4 /*yield*/, knex('user')
                            .insert({ email: registrationData.email,
                            password: hashedPassword,
                            is_registered: true,
                            has_chosen_topics: false })
                            .returning(['id', 'email', 'is_registered', 'has_chosen_topics'])];
                case 3:
                    result = _a.sent();
                    return [2 /*return*/, Promise.resolve({ response: result,
                            message: 'successful insertion into database',
                            success: true })];
                case 4:
                    error_1 = _a.sent();
                    displayMessage = error_1.detail
                        .split('(')
                        .join('')
                        .split(')')
                        .join('')
                        .split('email=')
                        .join('')
                        .split('Key')
                        .join('');
                    return [2 /*return*/, Promise.reject(new Error("Please use a different email: " + displayMessage))];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.registerUser = registerUser;
/** Authenticates user
 * @param {object} loginData containing the user login info - email and password.
 * @param {string} loginData.password
 * @param {string} loginData.email
 * @return {Promise<{}>}
 */
function verifyLogin(loginData) {
    return __awaiter(this, void 0, void 0, function () {
        var rows, res, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, knex('user').where({ email: loginData.email })];
                case 1:
                    rows = _a.sent();
                    return [4 /*yield*/, crypto
                            .compare({ password: loginData.password, hash: rows[0].password })];
                case 2:
                    res = _a.sent();
                    if (!res) return [3 /*break*/, 4];
                    return [4 /*yield*/, knex('user')
                            .where({ email: loginData.email })
                            .update({ last_login: loginData.last_login })];
                case 3:
                    _a.sent();
                    return [2 /*return*/, Promise.resolve({ email: loginData.email,
                            success: true, response: "ok",
                            has_chosen_topics: rows[0].has_chosen_topics, db_id: rows[0].id })];
                case 4: 
                // eslint-disable-next-line max-len
                return [2 /*return*/, Promise.reject(new Error("Credentials Error: Invalid username and/or password."))];
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    return [2 /*return*/, Promise.reject(new Error("Invalid Username / password."))];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.verifyLogin = verifyLogin;
/**
 * Function used for testing - should retrieve a user object from the database
 * @param {object} loginData
 * @param {string} loginData.email User name
 * @param {string} loginData.password plain text password
 * @return {Promise<{}>} An user object from the database if successful
 * otherwise an error
 */
function getUser(loginData) {
    return __awaiter(this, void 0, void 0, function () {
        var userObject, exception_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, knex('user')
                            .where({ email: loginData.email })];
                case 1:
                    userObject = _a.sent();
                    if (crypto.compare({ password: loginData.password,
                        hash: userObject[0].password })) {
                        return [2 /*return*/, Promise.resolve(userObject[0])];
                    }
                    else {
                        return [2 /*return*/, Promise.reject(new Error('Credentials Error: Invallid Password.'))];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    exception_1 = _a.sent();
                    return [2 /*return*/, Promise.reject(new Error(exception_1))];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getUser = getUser;
/** Creates a join to find all the topics for a given user
 * @param {object} userData Object containing the user's e-mail address

* @return {Promise<{}>} Returns a promise representing db query as an object
*/
function getUserTopics(userData) {
    // Get all topics a user is subscribed to
    return knex.select('email', 'name').from('user as U')
        .innerJoin('user_topic as UT', 'U.id', 'UT.user_id')
        .innerJoin('topic as T', 'UT.topic_id', 'T.id')
        .where('U.email', userData.email);
}
exports.getUserTopics = getUserTopics;
// /** Gets the bookmarks for a given user, performing join operations
//  * @param {object} userData
//  * @param {string} userData.email E-mail address
//  * @return {Promise<{}>} Returns a promise with the results of the db query
//  */
// export function getBookmarks (userData: { email: string }): Promise<any> {
//   // Get all saved bookedmarks for a specific user
//   return knex.select('email', 'url', 'headline',
//       'image_src', 'UA.id', 'UA.created_at')
//       .from('user as U')
//       .innerJoin('user_article as UA', 'U.id', 'UA.user_id')
//       .innerJoin('article as A', 'UA.article_id', 'A.id' )
//       .where('U.email', userData.email);
// }
/** Checks if the topics already exist in the DB. If not, add it.
 * Refreshes the user_topic table and adds updated data
 * @param {object} inputData
 * @param {string} inputData.email User's e-mail address
 * @param {number} inputData.database_id database id #
 * @param {[]} inputData.topicArray array of strings containing topic
 * @return {Promise<{}>}
 */
function updateTopicListForUser(inputData) {
    return __awaiter(this, void 0, void 0, function () {
        var firstResult, insertList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, knex.select('id', 'name').from('topic')];
                case 1:
                    firstResult = _a.sent();
                    insertList = createListOfTopicsToBeInsertedIntoDB(firstResult, inputData.topicArray);
                    if (!(insertList && insertList.length >= 1)) return [3 /*break*/, 4];
                    return [4 /*yield*/, insertNewTopicsIntoDB(insertList)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, updateUserTopicTable(inputData)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, updateUserTopicTable(inputData)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [4 /*yield*/, knex('user').where({ id: inputData.database_id })
                        .update({ has_chosen_topics: true })
                        .returning(['id', 'email', 'has_chosen_topics'])];
                case 7:
                    _a.sent();
                    return [2 /*return*/, Promise.resolve(firstResult)];
            }
        });
    });
}
exports.updateTopicListForUser = updateTopicListForUser;
/** Updates the user's password
 * @param {object} newData
 * @param {string} newData.email E-mail address
 * @param {string} newData.first_password matching password
 * @param {string} newData.second_password matching password
 * @return {Promise<{}>} An object representing the result of query
 * or an error
 */
function updateUserPassword(newData) {
    return __awaiter(this, void 0, void 0, function () {
        var result, hashedPassword, result_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = helperFunctions
                        .passwordMeetsSecurityRequirements({ first: newData.first_password,
                        second: newData.second_password });
                    if (!result) {
                        Promise.reject(new Error('Password does not meet security requirements'));
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, helperFunctions
                            .hashPasswordAsync(newData.first_password)];
                case 2:
                    hashedPassword = _a.sent();
                    return [4 /*yield*/, knex('user').where({ email: newData.email })
                            .update({ password: hashedPassword })
                            .returning(['id', 'email', 'password'])];
                case 3:
                    result_1 = _a.sent();
                    return [2 /*return*/, Promise.resolve({ returning: result_1, message: 'ok ' })];
                case 4:
                    error_2 = _a.sent();
                    return [2 /*return*/, Promise.reject(new Error("'unable to update password in database " + error_2))];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.updateUserPassword = updateUserPassword;
/** Checks if the article is in the article table already. If so, grab the id and
  then check the user_article table if it is associated with the user.
  If it is not in the article table - add it,
  grab the id and then add it to the user_article table
* @param {object} updateData
* @param {number} updateData.database_id: User's db id
* @param {string} updateData.url URL of the article
* @param {string} updateData.headline Short headline text
* @param {string} updateData.thumbnail href to thumbnmail image
* @return {Promise<{}>}
*/
function addBookmarkForUser(updateData) {
    return __awaiter(this, void 0, void 0, function () {
        var rows, rows1, resultingData, err_2, results, resultingData, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, knex('article').where({ url: updateData.url }).returning(['id'])];
                case 1:
                    rows = _a.sent();
                    if (!(rows.length === 0)) return [3 /*break*/, 8];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 6, , 7]);
                    return [4 /*yield*/, knex('article')
                            .insert({ url: updateData.url,
                            headline: updateData.headline,
                            image_src: updateData.thumbnail })
                            .returning(['id'])];
                case 3:
                    rows1 = _a.sent();
                    return [4 /*yield*/, knex('user_article')
                            .insert({ article_id: rows1[0].id, user_id: updateData.database_id })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, getBookmarks({ email: updateData.user_id })];
                case 5:
                    resultingData = _a.sent();
                    return [2 /*return*/, Promise.resolve({ response: resultingData })];
                case 6:
                    err_2 = _a.sent();
                    return [2 /*return*/, Promise.reject(new Error("" + err_2))];
                case 7: return [3 /*break*/, 14];
                case 8:
                    _a.trys.push([8, 13, , 14]);
                    return [4 /*yield*/, knex('user_article')
                            .where({ user_id: updateData.database_id,
                            article_id: rows[0].id })];
                case 9:
                    results = _a.sent();
                    if (!(results.length === 0)) return [3 /*break*/, 12];
                    return [4 /*yield*/, knex('user_article')
                            .insert({ article_id: rows[0].id,
                            user_id: updateData.database_id })];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, getBookmarks({ email: updateData.user_id })];
                case 11:
                    resultingData = _a.sent();
                    return [2 /*return*/, Promise.resolve({ response: resultingData })];
                case 12: return [3 /*break*/, 14];
                case 13:
                    err_3 = _a.sent();
                    return [2 /*return*/, Promise.reject(new Error("" + err_3))];
                case 14: return [2 /*return*/];
            }
        });
    });
}
exports.addBookmarkForUser = addBookmarkForUser;
/**
 * Deletes a bookmarked article from the user_article table
 * @param {object} articleUserData
 * @param {string} articleUserData.url_to_delete url of the article to delete
 * @param {number} articleUserData.user_id Database id for the user
 * @param {string} articleUserData.email
 */
function deleteBookmarkForUser(articleUserData) {
    return __awaiter(this, void 0, void 0, function () {
        var results1, targetArticleID, resultingData, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, getArticleIDByURL(articleUserData.url_to_delete)];
                case 1:
                    results1 = _a.sent();
                    if (!(results1.length > 0)) return [3 /*break*/, 4];
                    targetArticleID = results1[0].id;
                    return [4 /*yield*/, deleteUserArticleFavorite({ article_id: targetArticleID,
                            user_id: articleUserData.user_id })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, getBookmarks({ email: articleUserData.email })];
                case 3:
                    resultingData = _a.sent();
                    return [2 /*return*/, Promise.resolve({ result: resultingData })];
                case 4: return [3 /*break*/, 6];
                case 5:
                    err_4 = _a.sent();
                    return [2 /*return*/, Promise.reject(new Error('unable to delete entry from the user_article table.'))];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.deleteBookmarkForUser = deleteBookmarkForUser;
/**
 * Accesses the database and deletes all of the bookmarks associated with the user_id
 * @param {object} userData Object containing the e-mail and database_id
 * @param {number} userData.user_id Database user_id
 * @param {string} userData.email Email address
 * @return {Promise} Promise resulting from the database operation.
 */
function deleteAllBookmarksForUser(userData) {
    return __awaiter(this, void 0, void 0, function () {
        var resultingData, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, knex('user_article').del().where({ user_id: userData.user_id })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, getBookmarks({ email: userData.email })];
                case 2:
                    resultingData = _a.sent();
                    return [2 /*return*/, Promise.resolve({ result: resultingData })];
                case 3:
                    err_5 = _a.sent();
                    return [2 /*return*/, Promise.reject(err_5)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.deleteAllBookmarksForUser = deleteAllBookmarksForUser;
/**
 * Creates a list of topics to be inserted into the database
 * @param {array} listFromDB
 * @param {array} topicsToLookUp
 * @return {array} A finalized list of topics to look up
 */
function createListOfTopicsToBeInsertedIntoDB(listFromDB, topicsToLookUp) {
    // This will return two objects
    var finalList = [];
    topicsToLookUp.forEach(function (topicElement) {
        var foundElement = !listFromDB.find(function (el) {
            return el.name === topicElement;
        });
        if (foundElement)
            finalList.push(topicElement);
    });
    return finalList;
}
/**
 * Batch inserts a list of topics into the database.
 * @param {*} topicListArray
 * @return {Promise} the result from inserting new topics into the table
 */
function insertNewTopicsIntoDB(topicListArray) {
    return new Promise(function (resolve) {
        var batch = topicListArray.map(function (info) {
            return insertTopic(info);
        });
        resolve(Promise.all(batch));
    });
}
/**
 *
 * @param {string} stringTopic
 * @return {Promise}
 */
function insertTopic(stringTopic) {
    return knex('topic')
        .returning(['id', 'name'])
        .insert({ name: stringTopic });
}
/**
 * This function refreshes data and gets a current state of the topics database.
 * Then deletes all of the entries for the matching user_id in the user_topic table.
 * It then re-adds a refreshed collection of topics for the user.
 * @param {object} userData
 * @return {Promise}
 */
function updateUserTopicTable(userData) {
    return __awaiter(this, void 0, void 0, function () {
        var topicsFromDb, insertQuery;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, knex.select().table('topic')];
                case 1:
                    topicsFromDb = _a.sent();
                    return [4 /*yield*/, knex('user_topic')
                            .del()
                            .where('user_id', userData.database_id)
                            .returning(['user_id', 'topic_id'])];
                case 2:
                    _a.sent();
                    insertQuery = userData.topicArray.map(function (el) {
                        var fnd = topicsFromDb.find(function (qElement) {
                            return qElement.name === el;
                        });
                        return insertUserTopic({ user_id: userData.database_id,
                            topic_id: fnd.id });
                    });
                    // once the map is done, do a Promise.all for the mass insert
                    return [2 /*return*/, Promise.resolve(Promise.all(insertQuery))];
            }
        });
    });
}
/**
 *
 * @param {object} iData
 * @return {Promise}
 */
function insertUserTopic(iData) {
    return knex('user_topic')
        .returning(['user_id', 'topic_id'])
        .insert({ user_id: iData.user_id, topic_id: iData.topic_id });
}
/**
 * Search article database by URL and return the ID of the articles
 * @param {string} searchUrl search the article database by url
 * @return {Promise}
 */
function getArticleIDByURL(searchUrl) {
    return knex.select('id').from('article')
        .where({ url: searchUrl });
}
/**
 * Go into user_article DB and delete the particular record
 * @param {object} deleteInfo
 * @param {number} delete_info.article_id;
 * @param {number} delete_info.user_id
 * @return {Promise}
 */
function deleteUserArticleFavorite(deleteInfo) {
    return knex('user_article').del()
        .where({ article_id: deleteInfo.article_id })
        .andWhere({ user_id: deleteInfo.user_id });
}
/**
 * Gets all saved bookedmarks for a specific user
 * @param {object} userData
 * @return {Promise}
 */
function getBookmarks(userData) {
    return knex.select('email', 'url', 'headline', 'image_src', 'UA.id', 'UA.created_at').from('user as U')
        .innerJoin('user_article as UA', 'U.id', 'UA.user_id')
        .innerJoin('article as A', 'UA.article_id', 'A.id')
        .where('U.email', userData.email);
}
function clean(data) {
    return data.split('(')
        .join('')
        .split(')')
        .join('')
        .split('email=')
        .join('')
        .split('Key')
        .join('');
}
