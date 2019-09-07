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
            knex('user').where({ email: loginData.email }).update({ last_login: loginData.last_login }).then(() => {
              resolve({ email: loginData.email, success: true, response: `ok`, has_chosen_topics: rows[0].has_chosen_topics });
            });
            
          } else {
            reject({ email: loginData.email, success: false, response: `Invalid username and/or password `});
          }
        });
      }).catch((err) => {
        reject({ email: loginData.email, success: false, response: `Invalid username and/or password `});
      });
    });
  },

  getUserTopics: (userData) => {
    // This is going to send an array of {email: name:} objects
    return new Promise((resolve, reject) => {
      knex.select('email', 'name').from('user as U')
      .innerJoin('user_topic as UT', 'U.id', 'UT.user_id')
      .innerJoin('topic as T', 'UT.topic_id', 'T.id')
      .where('U.email', userData.email)
      .then((result) => {
        resolve(result);
      });
    });
  }
};

// Helper function that translates topic_id to an actual topic name.
// We basically hit the DB and get a topic.name from a topic_id / topic.id. 
// and return a string
function getTopicNameByID(inputI_id) {
  return new Promise((resolve)=> {
    knex('topic').select('name').where('id', inputI_id).then((result) => {
      resolve(result[0].name);
    });
  });
  
}