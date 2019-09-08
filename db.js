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
  },

  updateTopicListForUser: (inputData) => {
    return new Promise((resolve, reject) => {
      // First we need  to check if the topics already exist in the DB. If not, add it.
      // We need to retrieve the user id from the email_Data
      // We should hit the user_topic table, delete all entries where the user_id and user.id match, then we need to replace the data
      

      // Grab all of the topics by name
      knex.select('id', 'name').from('topic')
      .then((first_result) => {
       
        // Check if name exists. This result is an array of objects with a key 'name'
			
				const insertList = createListOfTopicsToBeInsertedIntoDB(first_result, inputData.topicArray);
				console.log("Line 59 insertList", insertList);
        //console.log(insertList);
        resolve(first_result);
      });
    });
  }
};

function createListOfTopicsToBeInsertedIntoDB(listFromDB, topicsToLookUp) {
  // This will return two objects
  let finalList = [];
	console.log(listFromDB);
  topicsToLookUp.forEach((topicElement) => {
    let foundElement = !listFromDB.find((el) => {
      return el.name === topicElement;
    });
    console.log("Line 75 Found element", topicElement, foundElement);
    if (foundElement) finalList.push(topicElement);
  });

  return finalList;
}