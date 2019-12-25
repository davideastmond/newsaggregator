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

      // Assert
      return expect(result.success).to.eql(true);
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
        // Should reject
        return expect(error.success).to.eql(false);
      }
    });
  });
});