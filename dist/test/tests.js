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
/* eslint-disable max-len */
require('dotenv').config();
var chai = require('chai');
var expect = chai.expect;
var dbFunctions = require('../helpers/db');
var helpers = require('../helpers/helper');
var duplicateHelpers = require('../helpers/duplicateArticlesHelper');
var axiosHelpers = require('../helpers/fetchTopicHelper');
var axios = require('axios');
describe('DB functions', function () {
    describe('DB Function: verifyUserLogin', function () {
        it('should return true if the e-mail and password combination are correctly verified', function () { return __awaiter(void 0, void 0, void 0, function () {
            var testUser, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        testUser = { email: process.env.TEST_USER, password: process.env.TEST_PASSWORD, last_login: new Date() };
                        return [4 /*yield*/, dbFunctions.verifyLogin(testUser)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, expect(result.success).to.eql(true)];
                }
            });
        }); });
        it('should not throw an error if the e-mail and password combination are correctly verified', function () { return __awaiter(void 0, void 0, void 0, function () {
            var testUser, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        testUser = { email: process.env.TEST_USER, password: process.env.TEST_PASSWORD, last_login: new Date() };
                        return [4 /*yield*/, dbFunctions.verifyLogin(testUser)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, expect(result.success).to.not.throw];
                }
            });
        }); });
        it('should retrieve a valid user object from the database, provided credentials are correct', function () { return __awaiter(void 0, void 0, void 0, function () {
            var testUser, result, exception_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        testUser = { email: process.env.TEST_USER, password: process.env.TEST_PASSWORD, last_login: new Date() };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, dbFunctions.getUser(testUser)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, expect(result.email).to.eql('email@email.com')];
                    case 3:
                        exception_1 = _a.sent();
                        console.log(exception_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        it('should throw an error if the e-mail and password combination are invalid', function () { return __awaiter(void 0, void 0, void 0, function () {
            var testUser, ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        testUser = { email: process.env.TEST_USER, password: "badPassword", last_login: new Date() };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, dbFunctions.verifyLogin(testUser)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        ex_1 = _a.sent();
                        return [2 /*return*/, expect(ex_1).to.throw];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        it('should throw if there is an invalid e-mail', function () { return __awaiter(void 0, void 0, void 0, function () {
            var testUser, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        testUser = { email: ')*#$@email.com', password: process.env.TEST_PASSWORD, last_login: new Date() };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, dbFunctions.verifyLogin(testUser)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/, expect(error_1).to.throw];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        it('should throw if there is an empty string e-mail', function () { return __awaiter(void 0, void 0, void 0, function () {
            var testUser, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        testUser = { email: '', password: process.env.TEST_PASSWORD, last_login: new Date() };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, dbFunctions.verifyLogin(testUser)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        return [2 /*return*/, expect(error_2).to.throw];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        it('should throw if empty password is provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            var testUser, result, ex_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        testUser = { email: process.env.TEST_USER, password: '', last_login: new Date() };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, dbFunctions.verifyLogin(testUser)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, expect(result.email).to.eql('')];
                    case 3:
                        ex_2 = _a.sent();
                        return [2 /*return*/, expect(ex_2.toString()).to.contain("Credentials Error: Invalid username and/or password.")];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    });
    describe('DB Function: registerUser', function () {
        it('should throw if a user with existing e-mail is already in the database', function () { return __awaiter(void 0, void 0, void 0, function () {
            var testUser, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        testUser = { email: process.env.TEST_USER, first_password: process.env.TEST_PASSWORD, second_password: process.env.TEST_PASSWORD };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, dbFunctions.registerUser(testUser)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        return [2 /*return*/, expect().to.throw];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        it('should throw if the password does not meet security requirements.', function () { return __awaiter(void 0, void 0, void 0, function () {
            var testUser, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        testUser = { email: process.env.TEST_USER, first_password: process.env.TEST_WEAK_PASSWORD, second_password: process.env.TEST_WEAK_PASSWORD };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, dbFunctions.registerUser(testUser)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        return [2 /*return*/, expect().to.throw];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        it('should return false if the first_password is different from the second_password', function () { return __awaiter(void 0, void 0, void 0, function () {
            var testUser, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        testUser = { email: process.env.TEST_USER, first_password: process.env.TEST_PASSWORD, second_password: process.env.TEST_ALTERNATE_PASSWORD };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, dbFunctions.registerUser(testUser)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _a.sent();
                        return [2 /*return*/, expect().to.throw];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    });
});
describe('Helper Functions', function () {
    describe('Password Meets Security requirements function', function () {
        it('should return true when a valid password is submitted', function () {
            var testPassword = { first: process.env.TEST_PASSWORD, second: process.env.TEST_PASSWORD };
            var result = helpers.passwordMeetsSecurityRequirements(testPassword);
            return expect(result).to.eql(true);
        });
        it('should return false when an invalid password is submitted', function () {
            var testPassword = { first: process.env.TEST_WEAK_PASSWORD, second: process.env.TEST_WEAK_PASSWORD };
            var result = helpers.passwordMeetsSecurityRequirements(testPassword);
            return expect(result).to.eql(false);
        });
        it('should throw if first password field is null', function () {
            var testPassword = { first: null, second: process.env.TEST_PASSWORD };
            return expect(function () { return helpers.passwordMeetsSecurityRequirements(testPassword); }).to.throw;
        });
        it('should throw if second password field is null', function () {
            var testPassword = { first: process.env.TEST_PASSWORD, second: null };
            return expect(function () { return helpers.passwordMeetsSecurityRequirements(testPassword); }).to.throw;
        });
        it('should return false if first and second passwords are valid but do not match', function () {
            var testPassword = { first: process.env.TEST_PASSWORD, second: process.env.TEST_ALTERNATE_PASSWORD };
            var result = helpers.passwordMeetsSecurityRequirements(testPassword);
            return expect(result).to.be.false;
        });
    });
    describe('doTopicsAxiosFetchRequest', function () {
        it("should return a collection of articles based on the user's topics. The array of topics returned should be of length > 0", function () { return __awaiter(void 0, void 0, void 0, function () {
            var resultingData, fetchResults;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbFunctions.getUserTopics({ email: process.env.TEST_USER })];
                    case 1:
                        resultingData = _a.sent();
                        return [4 /*yield*/, helpers.doTopicsAxiosFetchRequest({ userTopics: resultingData, db_id: 1 })];
                    case 2:
                        fetchResults = _a.sent();
                        return [2 /*return*/, expect(fetchResults.length).to.be.greaterThan(0)];
                }
            });
        }); });
    });
    describe('getDuplicatesFromArticleArray', function () {
        it('should there be articles with duplicate titles, the function should return false', function () {
            var jsonArticles = require('./duplicate_articles.json');
            var result = duplicateHelpers.getDuplicatesFromArticleArray(jsonArticles);
            return expect(result.test).to.be.false;
        });
        it('should return an array length of 4 for distinct articles whose duplicates have been removed', function () {
            var jsonArticles = require('./duplicate_articles.json');
            var result = duplicateHelpers.getDuplicatesFromArticleArray(jsonArticles);
            return expect(result.filteredList.length).to.eql(4);
        });
    });
    describe('Checking for duplicate articles using title as a criterion', function () {
        it('should there be articles with no titles, the function should return true', function () {
            var jsonArticles = require('./distinctive_articles.json');
            var result = duplicateHelpers.getDuplicatesFromArticleArray(jsonArticles);
            return expect(result.test).to.be.true;
        });
    });
    describe('Requests to newsApi', function () {
        it('should, when searching for a valid topic, return an array of articles', function () { return __awaiter(void 0, void 0, void 0, function () {
            var topic, result, articles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        topic = 'politics';
                        return [4 /*yield*/, axiosHelpers.axiosFetchFromApiSingleTopic(topic, 30)];
                    case 1:
                        result = _a.sent();
                        articles = result.data.articles;
                        return [2 /*return*/, expect(articles.length).to.eql(30)];
                }
            });
        }); });
        it('should, when searching for a rubbish topic, return an array of 0 articles', function () { return __awaiter(void 0, void 0, void 0, function () {
            var topic, result, articles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        topic = 'xyzm';
                        return [4 /*yield*/, axiosHelpers.axiosFetchFromApiSingleTopic(topic, 30)];
                    case 1:
                        result = _a.sent();
                        articles = result.data.articles;
                        return [2 /*return*/, expect(articles.length).to.eql(0)];
                }
            });
        }); });
    });
    describe('requests to newsaggregator API', function () {
        it('should return a 200 response when hitting the newsaggregator website homepage', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios.get("http://localhost:6565/")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, expect(result.status === 200)];
                }
            });
        }); });
        it('should return a 200 after request to /user/:id/feed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios.get("http://localhost:6565/user/:id/feed")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, expect(result.res === 200)];
                }
            });
        }); });
        it('should return a 200 after request to /user/:id/topics', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios.get("http://localhost:6565/user/:id/topics")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, expect(result.res === 200)];
                }
            });
        }); });
    });
});
