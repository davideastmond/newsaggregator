const mongoose = require('mongoose');
const recoverySchema = require('./schema/user-password-recovery-schema');
const model = mongoose.model("user_recovery", recoverySchema.userPasswordRecovery, "user_recovery");
const moment = require('moment');
module.exports = {
  insertRecoveryRecordIntoDatabase: async (record) => {
    try {
      const result = await model.create(record);
      return result;
    } catch (exception) {
      console.log(exception);
    }
  },

  /**
 * Hits the mongodb and verifies if a request has already been registered
 * @param {string} emailAddress 
 */
  passwordResetRequestAlreadyExists: async (emailAddress) => {
    try {
      const result = await model.findOne({ email: emailAddress }).exec();
      if (result) {
        // If the request is claimed return true
        if (result.claimed === true) {
          return { result: true, message: "Recovery request has already been claimed." }
        }
        // If the request is not expired, return true
        const isValid = moment().isBefore(result.expiryDate);
        if (isValid) {
          return { result: true, message: "Recovery request already exists" };
        }
      }
      return { result: false, message: "No request exists. OK to go" };
    } catch (exception) {
      console.log(exception);
    }
  },

  /**  
   * Deletes all requests for a given e-mail address
  */
  deleteExistingRequests: async (emailAddress) => {
    try {
      return await model.deleteMany({ email: emailAddress })
    } catch (exception) {
      console.log(exception);
    }
  },

  getRecordByEmail: async (emailAddress) => {
    try {
      return await model.find({ email: emailAddress }).exec();
    } catch (exception) {
      console.log(exception)
    }
  },

  getRecordByHash: async (hashValue) => {
    try {
      return await model.findOne({ hash: hashValue }).exec();
    } catch (exception) {
      console.log(exception)
    }
  }
}
