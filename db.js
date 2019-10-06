dbConnectString = require('./knexfile');
const knex = require('knex')(dbConnectString.development);
const bcrypt = require('bcrypt');
const helperFunctions = require('./helper');

// These are going to be our database functions
module.exports = {
  registerUser: (registrationData) => {
    // first check to see if password meets security requirements
    return new Promise((resolve, reject) => {
      if (!helperFunctions.passwordMeetsSecurityRequirements({ first: registrationData.first_password, second: registrationData.second_password })) {
        reject({error: 'password does not meet security requirements'});
        return;
      }

      // Next we'll hash the password
      helperFunctions.hashPasswordAsync((registrationData.first_password))
      .then((hashedPassword) => {
        // Once password is hashed, insert everything into the databse
        knex('user').insert({ email: registrationData.email, password: hashedPassword, is_registered: true, has_chosen_topics: false })
        .returning(['id', 'email', 'is_registered', 'has_chosen_topics'])
        .then((result) => {
          resolve({ response: result, message: 'successful insertion into database' });
          return;
        })
        .catch((error) => {
          reject({message: error });
          return;
        });
      });
    });
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
    // Get all topics a user is subscribed to
    return knex.select('email', 'name').from('user as U')
      .innerJoin('user_topic as UT', 'U.id', 'UT.user_id')
      .innerJoin('topic as T', 'UT.topic_id', 'T.id')
      .where('U.email', userData.email);
  },

  updateTopicListForUser: (inputData) => {
    return new Promise((resolve, reject) => {
      // First we need  to check if the topics already exist in the DB. If not, add it.
      // We need to retrieve the user id from the email_Data
      // We should hit the user_topic table, delete all entries where the user_id and user.id match, then we need to replace the data with updated info for the user's topics
    
      // Grab all of the topics by name
      knex.select('id', 'name').from('topic')
      .then((first_result) => {
        // Create a list of topics that need to be inserted into the database
        const insertList = createListOfTopicsToBeInsertedIntoDB(first_result, inputData.topicArray);
        if (insertList && insertList.length >= 1) {
          // We have things to insert
          insertNewTopicsIntoDB(insertList).then((resulting) => {
            update_user_topic_table(inputData).then();
          });
        } else {
          update_user_topic_table(inputData).then(); 
        }
        // hit the database and changed the has_chosen_topics value to true
        knex('user')
        .where({ id: inputData.database_id })
        .update({ has_chosen_topics: true})
        .returning(['id', 'email', 'has_chosen_topics'])
        .then(() => {
          resolve(first_result);
        });
      });
    });
  },
  
  updateUserPassword: (newData) => {
    return new Promise((resolve, reject) => {
      // First we make sure the password meets security requirements
      if (!helperFunctions.passwordMeetsSecurityRequirements({first: newData.first_password, second: newData.second_password })) {
        // Reject, as it doesn't meet requirements
        reject({ error: 'Password does not meet security requirements'});
        return;
      }
      
      // if the password has cleared requirements, hash it.
      helperFunctions.hashPasswordAsync(newData.first_password)
      .then((hashedPassword) => {
        // Now we have the hashed password. Update the database
        knex('user').where({ email: newData.forUser })
        .update({ password: hashedPassword })
        .returning(['id', 'email', 'password'])
        .then((result) => {
          resolve({ returning: result, message: 'ok'});
          return;
        })
        .catch((error) => {
          reject({ error: error, message: 'unable to update password in database'});
        });
      });
    });
  },
  
  updateSavedArticlesForUser: (updateData) => {
    /*
      update data should contain:
      database_id: int (the user's database_id)
      url: string

    */

    // We should first check if the article is in the article table already. If so, grab the id
    // then check the user_article table if it is associated with the user

    // If it is not in the article table - add it, grab the id and then add it to the user_article table
    return new Promise((resolve, reject) => {
      knex('article').where({ url: updateData.url}).returning(['id'])
      .then((rows) => {
        // If rows is zero, we need to insert a new entry, otherwise
        if (rows.length === 0) {
          knex('article').insert({ url: updateData.url }).returning(['id']).then((rows1) => {
            const article_id = rows1[0].id;
            
          });
        } else {

        }
      });
    });
  }
};

function createListOfTopicsToBeInsertedIntoDB(listFromDB, topicsToLookUp) {
  // This will return two objects
  let finalList = [];

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