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
var express = require('express');
// eslint-disable-next-line new-cap
var router = express.Router();
var axios = require('axios');
var helperFunctions = require('../dist/src/helpers/helper');
var check = require('express-validator').check;
var cache = require('memory-cache');
var cache_1 = require("../src/helpers/cache");
var cacheFunctions = require('../dist/src/helpers/cache');
var dbFunctions = require('../dist/src/helpers/db');
exports.default = router;
router.get('/', function (req, res) {
    if (req.session.session_id) {
        res.render('home.ejs', { logged_in: true, uId: req.session.session_id });
    }
    else {
        res.render('home.ejs', { logged_in: false, uId: null });
    }
});
router.get('/news', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reqDate, reqQuery, url, loggedInState, cacheData, response, bookmarkResponses, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reqDate = req.query.date;
                reqQuery = req.query.newsQuery;
                url = "https://newsapi.org/v2/everything?q=" + reqQuery + "&from=" + reqDate + "&sortBy=publishedAt&apiKey=" + process.env.PERSONAL_API_KEY + "&pageSize=30&language=en";
                loggedInState = false;
                cacheData = [];
                if (req.session.session_id) {
                    loggedInState = true;
                    if (cache.get(req.session.session_id)) {
                        cacheData = cacheFunctions.strip(cache.get(req.session.session_id));
                    }
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, axios.get(url)];
            case 2:
                response = _a.sent();
                if (!(cacheData === [] && loggedInState)) return [3 /*break*/, 4];
                return [4 /*yield*/, dbFunctions
                        .getBookmarks({ email: req.session.session_id })];
            case 3:
                bookmarkResponses = _a.sent();
                cacheData = cacheFunctions.strip(bookmarkResponses);
                res.render('news.ejs', { loggedIn: loggedInState,
                    bookmarkCache: cacheData,
                    articles: response.data.articles,
                    searchQuery: reqQuery, uId: req.session.session_id,
                    requestDate: reqDate, count: response.data.articles.length,
                    logged_in: req.session.session_id || false });
                return [3 /*break*/, 5];
            case 4:
                res.render('news.ejs', { loggedIn: loggedInState,
                    bookmarkCache: cacheData,
                    articles: response.data.articles,
                    searchQuery: reqQuery,
                    uId: req.session.session_id,
                    requestDate: reqDate,
                    count: response.data.articles.length,
                    logged_in: req.session.session_id || false });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                res.status(400).send({ error: error_1 });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.get('/headlines', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var url, response, strippedCache, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req.session.session_id ? loggedIn = true : loggedIn = false;
                req.query.country ?
                    // eslint-disable-next-line max-len
                    url = "https://newsapi.org/v2/top-headlines?sources=associated-press&apiKey=" + process.env.PERSONAL_API_KEY + "&pageSize=30&language=en" :
                    // eslint-disable-next-line max-len
                    url = "https://newsapi.org/v2/top-headlines?sources=google-news&apiKey=" + process.env.PERSONAL_API_KEY + "&pageSize=30&language=en";
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios.get(url)];
            case 2:
                response = _a.sent();
                strippedCache = cache_1.strip(cache.get(req.session.session_id));
                res.render('headlines.ejs', { articles: response.data.articles,
                    bookmarkCache: strippedCache,
                    uId: req.session.session_id,
                    loggedIn: loggedIn,
                    count: response.data.articles.length,
                    country: req.query.country || 'us',
                    logged_in: req.session.session_id || false });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.log(error_2);
                res.status(400).send({ error: error_2, message: 'Unable to retrieve' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/login', function (req, res) {
    if (!req.session.session_id) {
        res.render('login.ejs', { message: null });
    }
    else {
        // Sends user to dashboard if already logged in
        res.status(200).send({ response: 'send to dashboard ' });
    }
});
router.get('/register', function (req, res) {
    res.render('register.ejs');
});
router.get('/user/:id/feed', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var resultingData, fetchResults, listTopics, dataArticles, strippedCache, flattenedArticlesArray, filteredArticleData, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.session.session_id) return [3 /*break*/, 6];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, dbFunctions
                        .getUserTopics({ email: req.session.session_id })];
            case 2:
                resultingData = _a.sent();
                return [4 /*yield*/, helperFunctions
                        .doTopicsAxiosFetchRequest({ userTopics: resultingData,
                        db_id: req.session.database_id })];
            case 3:
                fetchResults = _a.sent();
                listTopics = resultingData.map(function (resultElement) {
                    return resultElement.name;
                });
                dataArticles = helperFunctions.compileAPIFetchData(fetchResults);
                strippedCache = cacheFunctions.strip(cache.get(req.session.session_id));
                flattenedArticlesArray = dataArticles.flat();
                filteredArticleData = Array.from(new Set(flattenedArticlesArray));
                res.render('feed.ejs', { topics_list: listTopics, uId: req.session.session_id,
                    data: resultingData,
                    arrayCount: filteredArticleData.length,
                    data_articles: filteredArticleData,
                    bookmarkCache: strippedCache });
                return [3 /*break*/, 5];
            case 4:
                error_3 = _a.sent();
                console.log(error_3);
                return [3 /*break*/, 5];
            case 5: return [3 /*break*/, 7];
            case 6:
                res.redirect('/login');
                _a.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); });
router.get('/user/:id/topics', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.session.session_id) return [3 /*break*/, 2];
                return [4 /*yield*/, dbFunctions.getUserTopics({ email: req.session.session_id })];
            case 1:
                result = _a.sent();
                res.render('topics.ejs', { email: req.params.id,
                    topics: result,
                    logged_in: true,
                    uId: req.session.session_id });
                return [3 /*break*/, 3];
            case 2:
                res.redirect('/login');
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/user/:id/profile', function (req, res) {
    /*
    This route will display the user's profile page.
    It will allow the user to change their password and add/delete news topics
    */
    if (req.session.session_id) {
        res.render('profile.ejs', { uId: req.session.session_id });
    }
    else {
        res.redirect('/login');
    }
});
router.get('/user/:id/bookmarks', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var response, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.session.session_id) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbFunctions.getBookmarks({ email: req.session.session_id })];
            case 2:
                response = _a.sent();
                res.render('bookmarks.ejs', { uId: req.session.session_id, data: response });
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                res.response(400).json({ message: 'Server Error' });
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                res.redirect('/');
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); });
router.put('/user/:id/profile', [check('pwdone')
        .trim().escape(),
    check('pwdtwo').trim()
        .escape()], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.session.session_id) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbFunctions
                        .updateUserPassword({ forUser: req.session.session_id,
                        first_password: req.body.pwdone,
                        second_password: req.body.pwdtwo })];
            case 2:
                _a.sent();
                res.status(200).json({ status: 'ok', newURL: '#' });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                res.status(400).json({ error: error_4.error,
                    message: 'Unable to update the password' });
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                res.redirect('/login');
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); });
router.put('/user/:id/topics', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updateData, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.session.session_id) return [3 /*break*/, 5];
                updateData = { email: req.session.session_id,
                    database_id: req.session.database_id,
                    topicArray: JSON.parse(req.body.topics) };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbFunctions.updateTopicListForUser(updateData)];
            case 2:
                _a.sent();
                res.status(200).json({ response: 'ok' });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                console.log(error_5);
                res.status(500).json({ status: 'unable to update the database' });
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                res.redirect('/');
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/register', [check('emailAddr').isEmail().trim().escape(),
    check('passwordOne').trim().escape(),
    check('passwordTwo').trim().escape()], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (req.session.session_id) {
                    res.status(400).send({ response: 'user should log out first before registering' });
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbFunctions
                        .registerUser({ email: req.body.emailAddr,
                        first_password: req.body.passwordOne,
                        second_password: req.body.passwordTwo,
                        is_registered: true })];
            case 2:
                result = _a.sent();
                req.session.session_id = result.response[0].email;
                req.session.database_id = result.response[0].id;
                res.status(200).json({ response: "/user/" + req.session.session_id + "/topics" });
                return [3 /*break*/, 4];
            case 3:
                error_6 = _a.sent();
                res.status(400).send({ error: "" + error_6 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/login', [check('email').isEmail().trim().escape(),
    check('password').trim().escape()], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var timeStamp, verificationObject, result, bookmarkData, _1, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                timeStamp = new Date();
                verificationObject = { email: req.body.email,
                    password: req.body.password,
                    last_login: timeStamp };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                return [4 /*yield*/, dbFunctions.verifyLogin(verificationObject)];
            case 2:
                result = _a.sent();
                req.session.session_id = req.body.email;
                req.session.database_id = result.db_id;
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, dbFunctions
                        .getBookmarks({ email: req.session.session_id })];
            case 4:
                bookmarkData = _a.sent();
                cache.put(req.session.session_id, bookmarkData);
                res.redirect("/user/" + req.session.session_id + "/feed");
                return [3 /*break*/, 6];
            case 5:
                _1 = _a.sent();
                res.redirect("/user/" + req.session.session_id + "/feed");
                return [3 /*break*/, 6];
            case 6: return [3 /*break*/, 8];
            case 7:
                err_2 = _a.sent();
                res.render('login.ejs', { message: err_2 });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
router.post('/user/:id/bookmarks', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var articleUpdatePackage, result, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.session.session_id) return [3 /*break*/, 5];
                articleUpdatePackage = { user_id: req.session.session_id,
                    database_id: req.session.database_id,
                    url: req.body.url,
                    headline: req.body.headlineText,
                    thumbnail: req.body.imageSrc };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbFunctions.addBookmarkForUser(articleUpdatePackage)];
            case 2:
                result = _a.sent();
                if (result.response) {
                    cache.put(req.session.session_id, result.response);
                    res.status(200).json({ response: 'ok' });
                }
                else {
                    res.status(400).json({ status: 'error updating database' });
                }
                return [3 /*break*/, 4];
            case 3:
                error_7 = _a.sent();
                res.status(400).json({ status: 'error updating database' });
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                res.redirect('/');
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); });
// Deletes a bookmarked favorite for a logged-in user
router.delete('/user/:id/bookmarks/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var bookmarkObject, result, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.session.session_id) return [3 /*break*/, 4];
                bookmarkObject = { email: req.session.session_id,
                    user_id: req.session.database_id,
                    url_to_delete: req.body.url };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbFunctions.deleteBookmarkForUser(bookmarkObject)];
            case 2:
                result = _a.sent();
                cache.put(req.session.session_id, result.result);
                res.status(200).json({ response: 'ok' });
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                res.status(400).json({ response: 'error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.delete('/user/:id/bookmarks', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var bookmarkObject, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.session.session_id) return [3 /*break*/, 2];
                bookmarkObject = { email: req.session.session_id,
                    user_id: req.session.database_id };
                return [4 /*yield*/, dbFunctions.deleteAllBookmarksForUser(bookmarkObject)];
            case 1:
                result = _a.sent();
                cache.put(req.session.session_id, result.result);
                res.status(200).json({ response: 'ok' });
                return [3 /*break*/, 3];
            case 2:
                res.status(404).json({ response: 'not authorized' });
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/logout', function (req, res) {
    req.session.session_id = null;
    console.log('LOGOUT MESSAGE', req.body.data);
    res.render('home.ejs', { logged_in: false, uId: null });
});
// eslint-disable-next-line no-extend-native
Object.defineProperty(Array.prototype, 'flat', {
    value: function (depth) {
        if (depth === void 0) { depth = 1; }
        return this.reduce(function (flat, toFlatten) {
            return flat.concat((Array.isArray(toFlatten) && (depth > 1)) ?
                toFlatten.flat(depth - 1) : toFlatten);
        }, []);
    },
});
