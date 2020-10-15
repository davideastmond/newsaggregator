/* eslint-disable max-len */
require('dotenv').config();
const helpers = require('./helper');

describe('Helper Functions', ()=> {
  describe('Password meets security requirements function', ()=> {
    it('should return true when a valid password is submitted', ()=> {
      const testPassword = { first: process.env.TEST_PASSWORD, second: process.env.TEST_PASSWORD };
      const result = helpers.passwordMeetsSecurityRequirements(testPassword);
      expect(result).toBe(true);
    });

    it('should return false when an invalid password is submitted', ()=> {
      const testPassword = { first: process.env.TEST_WEAK_PASSWORD, second: process.env.TEST_WEAK_PASSWORD };
      const result = helpers.passwordMeetsSecurityRequirements(testPassword);
      expect(result).toBe(false);
    });

    it('should throw if first password field is null', async ()=> {
      const testPassword = { first: null, second: process.env.TEST_PASSWORD };
      expect(()=> helpers.passwordMeetsSecurityRequirements(testPassword)).toThrow();
    });

    it('should throw if second password field is null', async ()=> {
      const testPassword = { first: process.env.TEST_PASSWORD, second: null };
      expect(()=> helpers.passwordMeetsSecurityRequirements(testPassword)).toThrow();
    });

    it('should return false if first and second passwords are valid but do not match', ()=> {
      const testPassword = { first: process.env.TEST_PASSWORD, second: process.env.TEST_ALTERNATE_PASSWORD };
      const result = helpers.passwordMeetsSecurityRequirements(testPassword);
      expect(result).toBe(false);
    });
  });
});
