const dbConnectString = require('../knexfile');
const knex = require('knex')(dbConnectString.development);
const crypto = require('../helpers/crypto');
const helperFunctions = require('./helper');

module.exports = {

  /** Registers the user into the system.
   * Ensures no duplicate accounts. Checks to see
   * if the password meets security requirements.
   * Hashes the password and creates a new record.
   * @param {object} registrationData contains email + passwords for verification
   * @param {string} registrationData.email Unique e-mail address
   * @param {string} registrationData.first_password matching passwords
   * @param {string} registrationData.second_password matching passwords
   * @return {Promise<{}>} A Promise containing an object
   * or an error message if fail.
   */
  registerUser: async (registrationData) => {
    // First check to see if password meets security requirements
    if (!helperFunctions
        .passwordMeetsSecurityRequirements({ first: registrationData.first_password,
          second: registrationData.second_password })) {
      return Promise.reject(new Error('Password does not meet security requirements'));
    }

    try {
      const hashedPassword = await crypto
          .hashPassword((registrationData.first_password));
      const result = await knex('user')
          .insert({ email: registrationData.email,
            password: hashedPassword,
            is_registered: true,
            has_chosen_topics: false })
          .returning(['id', 'email', 'is_registered', 'has_chosen_topics']);

      return Promise.resolve({ response: result,
        message: 'successful insertion into database',
        success: true });
    } catch (error) {
      const displayMessage = error.detail
          .split('(')
          .join('')
          .split(')')
          .join('')
          .split('email=')
          .join('')
          .split('Key')
          .join('');
      return Promise.reject(new Error(`Please use a different email: ${displayMessage}`));
    }
  },

  /** Authenticates user
   * @param {object} loginData containing the user login info - email and password.
   * @param {string} loginData.password
   * @param {string} loginData.email
   * @return {Promise<{}>}
   */
  verifyLogin: async function(loginData) {
    // Access the DB, verify user name, password and registration, return true or false
    try {
      const rows = await knex('user').where({ email: loginData.email });
      const res = await crypto
          .compare({ password: loginData.password, hash: rows[0].password });

      if (res) {
        await knex('user')
            .where({ email: loginData.email })
            .update({ last_login: loginData.last_login });
        return Promise.resolve({ email: loginData.email,
          success: true, response: `ok`,
          has_chosen_topics: rows[0].has_chosen_topics, db_id: rows[0].id });
      } else {
        // eslint-disable-next-line max-len
        return Promise.reject(new Error(`Credentials Error: Invalid username and/or password.`));
      }
    } catch (err) {
      return Promise.reject(new Error(`System Error: Unable to verify.` ));
    }
  },

  /**
   * Function used for testing - should retrieve a user object from the database
   * @param {object} loginData
   * @param {string} loginData.email User name
   * @param {string} loginData.password plain text password
   * @return {Promise<{}>} An user object from the database if successful
   * otherwise an error
   */
  getUser: async function(loginData) {
    try {
      const userObject = await knex('user')
          .where({ email: loginData.email });

      if (crypto.compare({ password: loginData.password,
        hash: userObject[0].password })) {
        return Promise.resolve(userObject[0]);
      } else {
        return Promise.reject(new Error('Credentials Error: Invallid Password.'));
      }
    } catch (exception) {
      return Promise.reject(new Error(exception));
    }
  },

  /** Creates a join to find all the topics for a given user
   * @param {object} userData Object containing the user's e-mail address
   * @param {string} userData.email User's e-mail address
   * @return {Promise<{}>} Returns a promise representing db query as an object
   */
  getUserTopics: (userData) => {
    // Get all topics a user is subscribed to
    return knex.select('email', 'name').from('user as U')
        .innerJoin('user_topic as UT', 'U.id', 'UT.user_id')
        .innerJoin('topic as T', 'UT.topic_id', 'T.id')
        .where('U.email', userData.email);
  },

  /** Gets the bookmarks for a given user, performing join operations
   * @param {object} userData
   * @param {string} userData.email E-mail address
   * @return {Promise<{}>} Returns a promise with the results of the db query
   */
  getBookmarks: (userData) => {
    // Get all saved bookedmarks for a specific user
    return knex.select('email', 'url', 'headline',
        'image_src', 'UA.id', 'UA.created_at')
        .from('user as U')
        .innerJoin('user_article as UA', 'U.id', 'UA.user_id')
        .innerJoin('article as A', 'UA.article_id', 'A.id' )
        .where('U.email', userData.email);
  },

  /** Checks if the topics already exist in the DB. If not, add it.
   * Refreshes the user_topic table and adds updated data
   * @param {object} inputData
   * @param {string} inputData.email User's e-mail address
   * @param {number} inputData.database_id database id #
   * @param {[]} inputData.topicArray array of strings containing topic
   * @return {Promise<{}>}
   */
  updateTopicListForUser: async (inputData) => {
    /* First we need to check if the topics already exist in the DB.
    If not, add them.
     We need to retrieve the user id from the email_Data
     We should hit the user_topic table, delete all entries
     where the user_id and user.id match,
     then we need to replace the data with
     updated info for the user's topics */

    const firstResult = await knex.select('id', 'name').from('topic');
    const insertList = createListOfTopicsToBeInsertedIntoDB(firstResult,
        inputData.topicArray);
    if (insertList && insertList.length >= 1) {
      await insertNewTopicsIntoDB(insertList);
      await updateUserTopicTable(inputData);
    } else {
      await updateUserTopicTable(inputData);
    }

    await knex('user').where({ id: inputData.database_id })
        .update({ has_chosen_topics: true })
        .returning(['id', 'email', 'has_chosen_topics']);

    return Promise.resolve(firstResult);
  },

  /** Updates the user's password
   * @param {object} newData
   * @param {string} newData.forUser E-mail address
   * @param {string} newData.first_password matching password
   * @param {string} newData.second_password matching password
   * @return {Promise<{}>} An object representing the result of query
   * or an error
   */
  updateUserPassword: async (newData) => {
    if (!helperFunctions
        .passwordMeetsSecurityRequirements({ first: newData.first_password,
          second: newData.second_password })) {
      // Reject, as it doesn't meet requirements
      Promise.reject(new Error({
        error: 'Password does not meet security requirements' }));
    }

    try {
      const hashedPassword = await helperFunctions
          .hashPasswordAsync(newData.first_password);
      const result = await knex('user').where({ email: newData.forUser })
          .update({ password: hashedPassword })
          .returning(['id', 'email', 'password']);
      return Promise.resolve({ returning: result, message: 'ok ' });
    } catch (error) {
      return Promise.reject(new Error({ error: error,
        message: 'unable to update password in database' }));
    }
  },

  /** Checks if the article is in the article table already. If so, grab the id and
    then check the user_article table if it is associated with the user.
    If it is not in the article table - add it,
    grab the id and then add it to the user_article table
  * @param {object} updateData
  * @param {number} updateData.database_id: User's db id
  * @param {string} updateData.url URL of the article
  * @param {string} updateData.headline Short headline text
  * @param {string} updateData.thumbnail href to thumbnmail image
  * @return {Promise<{}>}
  */
  addBookmarkForUser: async (updateData) => {
    /* We should first check if the article is
    in the article table already. If so, grab the id
    then check the user_article table if it is associated with the user.
    If it is not in the article table - add it,
    grab the id and then add it to the user_article table
    */

    const rows = await knex('article').where({ url: updateData.url }).returning(['id']);

    if (rows.length === 0) {
      try {
        const rows1 = await knex('article')
            .insert({ url: updateData.url,
              headline: updateData.headline,
              image_src: updateData.thumbnail })
            .returning(['id']);
        await knex('user_article')
            .insert({ article_id: rows1[0].id, user_id: updateData.database_id });
        const resultingData = await getBookmarks({ email: updateData.user_id });
        return Promise.resolve({ response: resultingData });
      } catch (err) {
        return Promise.reject(new Error({ error: err }));
      }
    } else {
      try {
        const results = await knex('user_article')
            .where({ user_id: updateData.database_id,
              article_id: rows[0].id });
        if (results.length === 0) {
          await knex('user_article')
              .insert({ article_id: rows[0].id,
                user_id: updateData.database_id });
          const resultingData = await getBookmarks({ email: updateData.user_id });
          return Promise.resolve({ response: resultingData });
        }
      } catch (err) {
        return Promise.reject(new Error({ error: err }));
      }
    }
  },

  /**
   * Deletes a bookmarked article from the user_article table
   * @param {object} articleUserData
   * @param {string} articleUserData.url_to_delete url of the article to delete
   * @param {number} articleUserData.user_id Database id for the user
   * @param {string} articleUserData.email
   */
  deleteBookmarkForUser: async (articleUserData) => {
    try {
      const results1 = await getArticleIDByURL(articleUserData.url_to_delete);
      if (results1.length > 0) {
        const targetArticleID = results1[0].id;
        await deleteUserArticleFavorite({ article_id: targetArticleID,
          user_id: articleUserData.user_id });
        const resultingData = await getBookmarks({ email: articleUserData.email });
        return Promise.resolve({ result: resultingData });
      }
    } catch (err) {
      return Promise.reject(new Error({
        error: 'unable to delete entry from the user_article table.' }));
    }
  },

  /**
   * Accesses the database and deletes all of the bookmarks associated with the user_id
   * @param {object} userData Object containing the e-mail and database_id
   * @param {number} userData.user_id Database user_id
   * @param {string} email Email address
   * @return {Promise} Promise resulting from the database operation.
   */
  deleteAllBookmarksForUser: async (userData) => {
    try {
      await knex('user_article').del().where({ user_id: userData.user_id });
      const resultingData = await getBookmarks({ email: userData.email });
      return Promise.resolve({ result: resultingData });
    } catch (err) {
      return Promise.reject(err);
    }
  },
};

/**
 * Creates a list of topics to be inserted into the database
 * @param {array} listFromDB
 * @param {array} topicsToLookUp
 * @return {array} A finalized list of topics to look up
 */
function createListOfTopicsToBeInsertedIntoDB(listFromDB, topicsToLookUp) {
  // This will return two objects
  const finalList = [];

  topicsToLookUp.forEach((topicElement) => {
    const foundElement = !listFromDB.find((el) => {
      return el.name === topicElement;
    });
    if (foundElement) finalList.push(topicElement);
  });

  return finalList;
}

/**
 * Batch inserts a list of topics into the database.
 * @param {*} topicListArray
 * @return {Promise} the result from inserting new topics into the table
 */
function insertNewTopicsIntoDB(topicListArray) {
  return new Promise((resolve) => {
    const batch = topicListArray.map((info) => {
      return insertTopic(info);
    });
    resolve(Promise.all(batch));
  });
}

/**
 *
 * @param {string} stringTopic
 * @return {Promise}
 */
function insertTopic(stringTopic) {
  return knex('topic')
      .returning(['id', 'name'])
      .insert({ name: stringTopic });
}

/**
 * This function refreshes data and gets a current state of the topics database.
 * Then deletes all of the entries for the matching user_id in the user_topic table.
 * It then re-adds a refreshed collection of topics for the user.
 * @param {object} userData
 * @return {Promise}
 */
async function updateUserTopicTable(userData) {
  const topicsFromDb = await knex.select().table('topic');
  await knex('user_topic')
      .del()
      .where('user_id', userData.database_id)
      .returning(['user_id', 'topic_id']);
  const insertQuery = user_data.topicArray.map((el) => {
    const fnd = topicsFromDb.find((qElement) => {
      return qElement.name === el;
    });
    return insertUserTopic({ user_id: userData.database_id,
      topic_id: fnd.id });
  });

  // once the map is done, do a Promise.all for the mass insert
  return Promise.resolve(Promise.all(insertQuery));
}

/**
 *
 * @param {object} iData
 * @return {Promise}
 */
function insertUserTopic(iData) {
  return knex('user_topic')
      .returning(['user_id', 'topic_id'])
      .insert({ user_id: iData.user_id, topic_id: iData.topic_id });
}

/**
 * Search article database by URL and return the ID of the articles
 * @param {string} searchUrl search the article database by url
 * @return {Promise}
 */
function getArticleIDByURL(searchUrl) {
  return knex.select('id').from('article')
      .where({ url: searchUrl });
}

/**
 * Go into user_article DB and delete the particular record
 * @param {object} deleteInfo
 * @param {number} delete_info.article_id;
 * @param {number} delete_info.user_id
 * @return {Promise}
 */
function deleteUserArticleFavorite(deleteInfo) {
  return knex('user_article').del()
      .where({ article_id: deleteInfo.article_id })
      .andWhere({ user_id: deleteInfo.user_id });
}

/**
 * Gets all saved bookedmarks for a specific user
 * @param {object} userData
 * @return {Promise}
 */
function getBookmarks(userData) {
  return knex.select('email', 'url', 'headline',
      'image_src', 'UA.id', 'UA.created_at').from('user as U')
      .innerJoin('user_article as UA', 'U.id', 'UA.user_id')
      .innerJoin('article as A', 'UA.article_id', 'A.id' )
      .where('U.email', userData.email);
}
