require('dotenv').config();
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const dbFunctions = require('../helpers/db');
chai.use(chaiAsPromised);


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

    it('should return false if the e-mail and password combination are invalid', async ()=> {
      // Arrange
      const testUser = { email: process.env.TEST_USER, password: `badPassword`, last_login: new Date() };

      // Act
      try {
        const result = await dbFunctions.verifyLogin(testUser);
      } catch (error) {
        // Assert - there should be an error thrown
        return expect(error.success).to.eql(false);
      }
      return expect(error.success).to.eql(false);
    });

    it('should return false if there is an invalid e-mail', async() => {
      // Arrange
      const testUser = { email: ")*#$@email.com", password: process.env.TEST_PASSWORD, last_login: new Date() };
      try {
        // Act
        const result = await dbFunctions.verifyLogin(testUser);
      } catch(error) {
        // Assert
        return expect(error.success).to.eql(false);
      }
    });

    it('should return false if there is a empty string e-mail', async ()=> {
      // Arrange
      const testUser = { email: "", password: process.env.TEST_PASSWORD, last_login: new Date() };
      try {
        // Act
        const result = await dbFunctions.verifyLogin(testUser);
      } catch (error) {
        //Assert
        return expect(error.success).to.eql(false);
      }
    });

    it('success should return false if there is a empty password string', async ()=> {
      const testUser = { email: process.env.TEST_USER, password: '', last_login: new Date() };
      try {
        const result = await dbFunctions.verifyLogin(testUser);
      } catch (error) {
        return expect(error.success).to.eql(false);
      }
    });
  });
  describe('DB Function: registerUser', ()=> {
    it('success should return false if a user with existing e-mail is already in the database', async ()=> {
      const testUser = { email: process.env.TEST_USER, first_password: process.env.TEST_PASSWORD, second_password: process.env.TEST_PASSWORD };

      try {
        const result = await dbFunctions.registerUser(testUser);
      } catch (error) {
        return expect(error.success).to.eql(false);
      }
    });
    it('success should return false if the password does not meet security requirements.', async()=> {
      const testUser = { email: process.env.TEST_USER, first_password: process.env.TEST_WEAK_PASSWORD, second_password: process.env.TEST_WEAK_PASSWORD };
  
      try {
        const result = await dbFunctions.registerUser(testUser);
      } catch (error) {
        return expect(error.success).to.eql(false);
      }
    });

    it('success should return false if the first_password is different from the second_password', async()=> {
      const testUser = { email: process.env.TEST_USER, first_password: process.env.TEST_PASSWORD, second_password: process.env.TEST_ALTERNATE_PASSWORD };

      try {
        const result = await dbFunctions.registerUser(testUser);
      } catch (error) {
        return expect(error.success).to.eql(false);
      }
    });
  });

  
});