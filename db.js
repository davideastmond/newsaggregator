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
    // Assuming we have user email
    return new Promise((resolve, reject) => {
      knex('user').select('id').where('email', userData.email).then((first_rows) => {
        const user_id = first_rows[0].id; // A user ID
        knex('user_topic').select('topic_id').where('user_id', user_id).then((second_rows) => {
          
          // We have all of the topic_ids for the specified user - all we have to do is get the names. So
          // we will map each topic_id and return a proper name 
          const finalObj = second_rows.map((element) => {
            return getTopicNameByID(element.topic_id);
          });

          const res = Promise.all(finalObj);
          resolve(res);
        });
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