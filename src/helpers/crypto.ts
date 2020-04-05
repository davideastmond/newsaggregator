import { PasswordObject } from './types/types'

/*
This file handles all hashing and de-hashing for passwords
*/
const bcrypt = require('bcryptjs');
require('dotenv').config();

const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS));

/** Hashes plain-text password
 * @param {string} data plain text password
 * @return {Promise<string>} Resolves to a string representing a hashed password
 */
export async function hashPassword(data: string): Promise<string> {
  try {
    return Promise.resolve(await bcrypt.hash(data, salt));
  } catch (ex) {
    return Promise.reject(new Error(ex));
  }
}

/**
 * Verifies plain-text password with hashed string
 * @param {PasswordObject} data
 * @return {Promise<boolean>} boolean indicating if the hash matches
 */
export async function compare(data: PasswordObject): Promise<Boolean>{
  return await bcrypt.compare(data.password, data.hash);
}

