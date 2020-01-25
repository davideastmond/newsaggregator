/* eslint-disable max-len */
require('dotenv').config();
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const dbFunctions = require('../helpers/db');
const helpers = require('../helpers/helper');
const axiosHelpers = require('../helpers/fetchTopicHelper');

describe('DB functions', ()=> {
  describe('DB Function: verifyUserLogin', ()=> {
    it('should return true if the e-mail and password combination are correctly verified', async ()=> {
      // Arrange
      const testUser = { email: process.env.TEST_USER, password: process.env.TEST_PASSWORD, last_login: new Date() };

      // Act

      const result = await dbFunctions.verifyLogin(testUser);
      return expect(result.success).to.eql(true);

      // Assert
    });

    it('should not throw an error if the e-mail and password combination are correctly verified', async ()=> {
      // Arrange
      const testUser = { email: process.env.TEST_USER, password: process.env.TEST_PASSWORD, last_login: new Date() };

      // Act

      const result = await dbFunctions.verifyLogin(testUser);
      return expect(result.success).to.not.throw;

      // Assert
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
      // Arrange
      const testUser = { email: process.env.TEST_USER, password: `badPassword`, last_login: new Date() };
      try {
        await dbFunctions.verifyLogin(testUser);
      } catch (ex) {
        return expect(ex).to.throw;
      }
    });

    it('should throw if there is an invalid e-mail', async () => {
      // Arrange
      const testUser = { email: ')*#$@email.com', password: process.env.TEST_PASSWORD, last_login: new Date() };
      try {
        // Act
        await dbFunctions.verifyLogin(testUser);
      } catch (error) {
        // Assert
        return expect(error).to.throw;
      }
    });

    it('should throw if there is a empty string e-mail', async ()=> {
      // Arrange
      const testUser = { email: '', password: process.env.TEST_PASSWORD, last_login: new Date() };
      try {
        // Act
        await dbFunctions.verifyLogin(testUser);
      } catch (error) {
        // Assert
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
      // Arrange
      const testPassword = { first: process.env.TEST_PASSWORD, second: process.env.TEST_PASSWORD };
      // Act
      const result = helpers.passwordMeetsSecurityRequirements(testPassword);
      // Assert
      return expect(result).to.eql(true);
    });

    it('should return false when an invalid password is submitted', ()=> {
      // Arrange
      const testPassword = { first: process.env.TEST_WEAK_PASSWORD, second: process.env.TEST_WEAK_PASSWORD };
      // Act
      const result = helpers.passwordMeetsSecurityRequirements(testPassword);
      // Assert
      return expect(result).to.eql(false);
    });

    it('should throw if first password field is null', ()=> {
      // Arrange
      const testPassword = { first: null, second: process.env.TEST_PASSWORD };
      // Act
      // Assert
      return expect(()=> helpers.passwordMeetsSecurityRequirements(testPassword)).to.throw;
    });

    it('should throw if second password field is null', ()=> {
      // Arrange
      const testPassword = { first: process.env.TEST_PASSWORD, second: null };
      // Act
      // Assert
      return expect(()=> helpers.passwordMeetsSecurityRequirements(testPassword)).to.throw;
    });

    it('should return false if first and second passwords are valid but do not match', ()=> {
      // Arrange
      const testPassword = { first: process.env.TEST_PASSWORD, second: process.env.TEST_ALTERNATE_PASSWORD };

      // Act
      const result = helpers.passwordMeetsSecurityRequirements(testPassword);

      // Assert
      return expect(result).to.be.false;
    });
  });

  describe('doTopicsAxiosFetchRequest', ()=> {
    it(`should return a collection of  articles based on the user's topics. The array of topics returned should be of length > 0`, async ()=> {
      // Arrange
      const resultingData = await dbFunctions.getUserTopics({ email: process.env.TEST_USER });
      // Act
      const fetchResults = await helpers.doTopicsAxiosFetchRequest({ userTopics: resultingData, db_id: 1 });

      // Assert
      return expect(fetchResults.length).to.be.greaterThan(0);
    });
  });

  describe('getDuplicatesFromArticleArray', ()=> {
    it('should return only unique articles based on headline title', ()=> {
      // Arrange
      throw new Error('not implemented yet');
      // Act

      // Assert
    });
  });

  describe('Requests to the api', ()=> {
    it('should, when search for a valid topic, return an array of articles', async ()=> {
      const topic = 'politics';
      const result = await axiosHelpers.axiosFetchFromApiSingleTopic(topic, 30);
      const { articles } = result.data;
      return expect(articles.length).to.eql(30);
    });

    it('should, when search for a rubbish topic, return an array of 0 articles', async ()=> {
      const topic = 'xyzm';
      const result = await axiosHelpers.axiosFetchFromApiSingleTopic(topic, 30);
      const { articles } = result.data;
      return expect(articles.length).to.eql(0);
    });
  });
});
