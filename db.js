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
              resolve({ email: loginData.email, success: true, response: `ok`, has_chosen_topics: rows[0].has_chosen_topics, db_id: rows[0].id });
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

        // Create a list of topics that need to be inserted into the database
				const insertList = createListOfTopicsToBeInsertedIntoDB(first_result, inputData.topicArray);
				if (insertList && insertList.length >= 1) {
					// We have things to insert
					insertNewTopicsIntoDB(insertList).then((resulting) => {
						update_user_topic_table(inputData).then((resulting_again)=> {
							// Send some kind of response
							console.log("62-- resulting again after insertList", resulting_again);
						});
					});
				} else {
					update_user_topic_table(inputData).then((resulting_again)=> {
						// Send some kind of response
						console.log("62-- resulting again", resulting_again);
					});
				}
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
    if (foundElement) finalList.push(topicElement);
  });

  return finalList;
}

function insertNewTopicsIntoDB(topicListArray) {
	
	return new Promise((resolve, reject) => {
		const batch = topicListArray.map((info) => {
			return insertTopic(info);
		});

		resolve(Promise.all(batch));
	});
}

function insertTopic(string_topic) {
	return knex('topic')
	.returning(['id', 'name'])
	.insert({ name: string_topic});
}

function update_user_topic_table(user_data) {
	return new Promise((resolve, reject) => {
		console.log("Line 104 Update user table hit");
		// Refresh and get a current state of the topics database. Then we delete all of the entries for the matching user_id in the user_topic table
		// and then re-add a refresh collection of topics for the user
		knex.select().table('topic').then((topics_from_db) => {
			knex('user_topic').del().where('user_id', user_data.database_id).returning(['user_id', 'topic_id'])
			.then(() => {
				// We've deleted all the user_topic ids

				const insert_query = user_data.topicArray.map((el) => {
					const fnd = topics_from_db.find((qElement) => {
						return qElement.name === el;
					});
					return insertUser_Topic({user_id: user_data.database_id, topic_id: fnd.id });
				});

				// once the map is done, do a Promise.all for the mass insert
				resolve(Promise.all(insert_query));
			});
		});
	});

}

function insertUser_Topic(iData) {
	return knex('user_topic')
	.returning(['user_id', 'topic_id'])
	.insert({ user_id: iData.user_id, topic_id: iData.topic_id });
}