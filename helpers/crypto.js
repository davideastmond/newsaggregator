/*
This file handles all hashing and de-hashing for passwords
*/
const bcrypt = require('bcryptjs');
require('dotenv').config();
const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS));
module.exports = {
  /** Hashes plain-text password
   * @param {string} data plain text password
   * @return {Promise<string>} Resolves to a string representing a hashed password
   */
  hashPassword: async (data) => {
    try {
      return Promise.resolve(await bcrypt.hash(data, salt));
    } catch (ex) {
      return Promise.reject(new Error(ex));
    }
  },

  /**
   * Verifies plain-text password with hashed string
   * @param {object} data
   * @param {string} data.password
   * @param {string} data.hash
   * @return {Promise<boolean>} boolean indicating if the hash matches
   */
  compare: async (data)=> {
    return await bcrypt.compare(data.password, data.hash);
  },
};
