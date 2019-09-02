
dbConnectString = require('./knexfile');
const knex = require('knex')(dbConnectString.development);
const bcrypt = require('bcrypt');
// These are going to be our database functions
module.exports = {
  registerUser: (registrationData) => {
    return knex('user').insert(registrationData.user);
  },
  
  verifyLogin: (loginData) => {
    // Access the DB, verify user name, password and registration, return true or false
    return new Promise ((resolve, reject) => {
      knex('user').where({ email: loginData.email }).then ((rows) => {
        
        bcrypt.compare(loginData.password, rows[0].password, (err, res) => {
          if (res) {
            
            // If the login is successful, we need to timestamp in the database.
            knex('user').where({ email: loginData.email }).update({ last_login: loginData.last_login }).then(()=> {
              console.log("Updated in database log?");
              resolve({ email: loginData.email, success: true, response: `ok` });
            });
            
          } else {
            reject({ email: loginData.email, success: false, response: `Invalid username and/or password `});
          }
        });
      }).catch((err) => {
        reject({ email: loginData.email, success: false, response: `Invalid username and/or password `});
      });
    });
  }
};