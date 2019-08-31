
dbConnectString = require('./knexfile');
const knex = require('knex')(dbConnectString.development);

// These are going to be our database functions
module.exports = {
  registerUser: (registrationData) => {
    return knex('user').insert(registrationData.user);
  }
};