/* eslint-disable max-len */
// cache.put('prec', [ { email: req.body.email, hash: hash, claimed: false, requestDate: datetime.now() } ]);
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const cacheFunction = require('./cache');
describe('cache functions', ()=> {
  test('contains function should return correct value', ()=> {
    const cache = require('memory-cache');
    const data = { email: process.env.TEST_USER, hash: uuidv4(), claimed: false, requestDate: Date.now() };
    cacheFunction.write(cache, data);
    expect(cacheFunction.contains(cache, `email@email.com`)).toBe(true);
    expect(cacheFunction.contains(cache, `zenzenzen@email.com`)).toBe(false);
  });
});

