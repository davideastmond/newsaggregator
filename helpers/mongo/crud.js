const mongoose = require('mongoose');
const recoverySchema = require('./schema/password-recovery/user-password-recovery-schema');
const recoveryModel = mongoose.model("user_recovery", recoverySchema.userPasswordRecovery, "user_recovery");
const newsSourceModel = require('./schema/news-sources/news-sources-schema')
const dayjs = require('dayjs');
module.exports = {
  insertRecoveryRecordIntoDatabase: async (record) => {
    try {
      const result = await recoveryModel.create(record);
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
      const result = await recoveryModel.findOne({ email: emailAddress }).exec();
      if (result) {
        // If the request is claimed return true
        if (result.claimed === true) {
          return { result: true, message: "Recovery request has already been claimed." }
        }
        // If the request is not expired, return true
        const isValid = dayjs().isBefore(result.expiryDate);
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
      return await recoveryModel.deleteMany({ email: emailAddress })
    } catch (exception) {
      console.log(exception);
    }
  },

  getRecordByEmail: async (emailAddress) => {
    try {
      return await recoveryModel.find({ email: emailAddress }).exec();
    } catch (exception) {
      console.log(exception)
    }
  },

  getRecordByHash: async (hashValue) => {
    try {
      return await recoveryModel.findOne({ hash: hashValue }).exec();
    } catch (exception) {
      console.log(exception)
    }
  },

  insertDefaultNewsSourceRecordByEmail: async (emailAddress) => {
    const defaultRecord = {
      email: emailAddress
    }
    try {
      const record = await newsSourceModel.findOne({ email: emailAddress });
      if (!record) {
        const result = await newsSourceModel.create(defaultRecord);
        return result;
      }
      return record;
    } catch (exception) {
      console.log(exception)
    }
  }
}
