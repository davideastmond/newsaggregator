/* eslint-disable max-len */
require('dotenv').config();
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const dbFunctions = require('../helpers/db');
const helpers = require('../helpers/helper');
const duplicateHelpers = require('../helpers/duplicateArticlesHelper');
const axiosHelpers = require('../helpers/fetchTopicHelper');

describe('DB functions', ()=> {
  describe('DB Function: verifyUserLogin', ()=> {
    it('should return true if the e-mail and password combination are correctly verified', async ()=> {
      const testUser = { email: process.env.TEST_USER, password: process.env.TEST_PASSWORD, last_login: new Date() };
      const result = await dbFunctions.verifyLogin(testUser);
      return expect(result.success).to.eql(true);
    });

    it('should not throw an error if the e-mail and password combination are correctly verified', async ()=> {
      const testUser = { email: process.env.TEST_USER, password: process.env.TEST_PASSWORD, last_login: new Date() };
      const result = await dbFunctions.verifyLogin(testUser);
      return expect(result.success).to.not.throw;
    });

    it('should retrieve a valid user object from the database, provided credentials are correct', async ()=> {
      const testUser = { email: process.env.TEST_USER, password: process.env.TEST_PASSWORD, last_login: new Date() };

      try {
        const result = await dbFunctions.getUser(testUser);
        return expect(result.email).to.eql('email@email.com');
      } catch (exception) {
        console.log(exception);
      }
    });

    it('should throw an error if the e-mail and password combination are invalid', async ()=> {
      const testUser = { email: process.env.TEST_USER, password: `badPassword`, last_login: new Date() };

      try {
        await dbFunctions.verifyLogin(testUser);
      } catch (ex) {
        return expect(ex).to.throw;
      }
    });

    it('should throw if there is an invalid e-mail', async () => {
      const testUser = { email: ')*#$@email.com', password: process.env.TEST_PASSWORD, last_login: new Date() };

      try {
        await dbFunctions.verifyLogin(testUser);
      } catch (error) {
        return expect(error).to.throw;
      }
    });

    it('should throw if there is a empty string e-mail', async ()=> {
      const testUser = { email: '', password: process.env.TEST_PASSWORD, last_login: new Date() };

      try {
        await dbFunctions.verifyLogin(testUser);
      } catch (error) {
        return expect(error).to.throw;
      }
    });

    it('should eventually throw if empty password is provided', async ()=> {
      const testUser = { email: process.env.TEST_USER, password: '', last_login: new Date() };

      try {
        const result = await dbFunctions.verifyLogin(testUser);
        return expect(result.email).to.eql('');
      } catch (ex) {
        return expect(ex.toString()).to.contain(`Credentials Error: Invalid username and/or password.`);
      }
    });
  });

  describe('DB Function: registerUser', ()=> {
    it('success throw if a user with existing e-mail is already in the database', async ()=> {
      const testUser = { email: process.env.TEST_USER, first_password: process.env.TEST_PASSWORD, second_password: process.env.TEST_PASSWORD };

      try {
        await dbFunctions.registerUser(testUser);
      } catch (error) {
        return expect().to.throw;
      }
    });

    it('success should throw if the password does not meet security requirements.', async ()=> {
      const testUser = { email: process.env.TEST_USER, first_password: process.env.TEST_WEAK_PASSWORD, second_password: process.env.TEST_WEAK_PASSWORD };

      try {
        await dbFunctions.registerUser(testUser);
      } catch (error) {
        return expect().to.throw;
      }
    });

    it('success should return false if the first_password is different from the second_password', async ()=> {
      const testUser = { email: process.env.TEST_USER, first_password: process.env.TEST_PASSWORD, second_password: process.env.TEST_ALTERNATE_PASSWORD };

      try {
        await dbFunctions.registerUser(testUser);
      } catch (error) {
        return expect().to.throw;
      }
    });
  });
});

describe('Helper Functions', ()=> {
  describe('Password Meets Security requirements function', ()=> {
    it('should return true when a valid password is submitted', ()=> {
      const testPassword = { first: process.env.TEST_PASSWORD, second: process.env.TEST_PASSWORD };
      const result = helpers.passwordMeetsSecurityRequirements(testPassword);
      return expect(result).to.eql(true);
    });

    it('should return false when an invalid password is submitted', ()=> {
      const testPassword = { first: process.env.TEST_WEAK_PASSWORD, second: process.env.TEST_WEAK_PASSWORD };
      const result = helpers.passwordMeetsSecurityRequirements(testPassword);
      return expect(result).to.eql(false);
    });

    it('should throw if first password field is null', ()=> {
      const testPassword = { first: null, second: process.env.TEST_PASSWORD };
      return expect(()=> helpers.passwordMeetsSecurityRequirements(testPassword)).to.throw;
    });

    it('should throw if second password field is null', ()=> {
      const testPassword = { first: process.env.TEST_PASSWORD, second: null };
      return expect(()=> helpers.passwordMeetsSecurityRequirements(testPassword)).to.throw;
    });

    it('should return false if first and second passwords are valid but do not match', ()=> {
      const testPassword = { first: process.env.TEST_PASSWORD, second: process.env.TEST_ALTERNATE_PASSWORD };
      const result = helpers.passwordMeetsSecurityRequirements(testPassword);
      return expect(result).to.be.false;
    });
  });

  describe('doTopicsAxiosFetchRequest', ()=> {
    it(`should return a collection of articles based on the user's topics. The array of topics returned should be of length > 0`, async ()=> {
      const resultingData = await dbFunctions.getUserTopics({ email: process.env.TEST_USER });
      const fetchResults = await helpers.doTopicsAxiosFetchRequest({ userTopics: resultingData, db_id: 1 });
      return expect(fetchResults.length).to.be.greaterThan(0);
    });
  });

  describe('getDuplicatesFromArticleArray', ()=> {
    it('should there be articles with duplicate titles, the function should return false', ()=> {
      const jsonArticles = require('./duplicate_articles.json');
      const result = duplicateHelpers.getDuplicatesFromArticleArray(jsonArticles);
      return expect(result.test).to.be.false;
    });

    it('should return an array length of 4 for distinct articles whose duplicates have been removed', ()=> {
      const jsonArticles = require('./duplicate_articles.json');
      const result = duplicateHelpers.getDuplicatesFromArticleArray(jsonArticles);
      return expect(result.filteredList.length).to.eql(4);
    });
  });

  describe('Checking for duplicate articles using title as a criterion', ()=> {
    it('should there be articles with no titles, the function should return true', ()=> {
      const jsonArticles = require('./distinctive_articles.json');
      const result = duplicateHelpers.getDuplicatesFromArticleArray(jsonArticles);
      return expect(result.test).to.be.true;
    });
  });

  describe('Requests to newsApi', ()=> {
    it('should, when search for a valid topic, return an array of articles', async ()=> {
      const topic = 'politics';
      const result = await axiosHelpers.axiosFetchFromApiSingleTopic(topic, 30);
      const { articles } = result.data;
      return expect(articles.length).to.eql(30);
    });

    it('should, when searching for a rubbish topic, return an array of 0 articles', async ()=> {
      const topic = 'xyzm';
      const result = await axiosHelpers.axiosFetchFromApiSingleTopic(topic, 30);
      const { articles } = result.data;
      return expect(articles.length).to.eql(0);
    });
  });
});
