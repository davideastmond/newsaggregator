/* eslint-disable max-len */
require('dotenv').config();
const dbFunctions = require('../helpers/db');

describe('DB functions', ()=> {
  describe('User login verification database function tests', ()=> {
    test('should return true if the e-mail and password combination are correctly verified', async ()=> {
      const testUser = { email: process.env.TEST_USER, password: process.env.TEST_PASSWORD, last_login: new Date() };
      const result = await dbFunctions.verifyLogin(testUser);
      expect(result.success).toBe(true);
    });

    test('should not throw an error if the e-mail and password combination are correctly verified', async ()=> {
      const testUser = { email: process.env.TEST_USER, password: process.env.TEST_PASSWORD, last_login: new Date() };
      expect(async ()=> {
        await dbFunctions.verifyLogin(testUser);
      }).not.toThrow();
    });

    test('should retrieve a valid user object from the database when credentials are correct', async ()=> {
      const testUser = { email: process.env.TEST_USER, password: process.env.TEST_PASSWORD, last_login: new Date() };
      const result = await dbFunctions.getUser(testUser);
      expect(result.email).toBe('email@email.com');
    });

    test('should throw an error if the e-mail and password combination are invalid', async ()=> {
      const testUser = { email: process.env.TEST_USER, password: `badPassword`, last_login: new Date() };
      await expect(dbFunctions.verifyLogin(testUser)).rejects.toThrow();
    });

    test('should throw if there is an invalid e-mail', async () => {
      const testUser = { email: ')*#$@email.com', password: process.env.TEST_PASSWORD, last_login: new Date() };
      await expect(
          dbFunctions.verifyLogin(testUser),
      ).rejects.toThrow();
    });

    test('should throw if there is an empty string e-mail', async ()=> {
      const testUser = { email: '', password: process.env.TEST_PASSWORD, last_login: new Date() };
      await expect(
          dbFunctions.verifyLogin(testUser),
      ).rejects.toThrow();
    });

    test('should throw if empty password is provided', async ()=> {
      const testUser = { email: process.env.TEST_USER, password: '', last_login: new Date() };
      await expect(dbFunctions.verifyLogin(testUser)).rejects.toThrow('Credentials Error: Invalid username and/or password');
    });
  });

  describe('Register user database function tests', ()=> {
    it('should throw if a user with existing e-mail is already in the database', async ()=> {
      const testUser = { email: process.env.TEST_USER, first_password: process.env.TEST_PASSWORD, second_password: process.env.TEST_PASSWORD };
      await expect(dbFunctions.registerUser(testUser)).rejects.toThrow();
    });

    it('should throw if the password does not meet security requirements.', async ()=> {
      const testUser = { email: process.env.TEST_USER, first_password: process.env.TEST_WEAK_PASSWORD, second_password: process.env.TEST_WEAK_PASSWORD };
      await expect(dbFunctions.registerUser(testUser)).rejects.toThrow();
    });

    it('should throw the first_password is different from the second_password', async ()=> {
      const testUser = { email: process.env.TEST_USER, first_password: process.env.TEST_PASSWORD, second_password: process.env.TEST_ALTERNATE_PASSWORD };
      await expect(dbFunctions.registerUser(testUser)).rejects.toThrow();
    });
  });
});
