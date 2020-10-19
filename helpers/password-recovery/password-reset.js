const { sendPasswordResetEmail } = require('../mailer/mailer');
const { v4: uuidv4 } = require('uuid');
const crud = require('../mongo/crud');
const crypto = require('../crypto/crypto');
const assert = require('assert');
const moment = require('moment');
const db = require('../db/db');
const e = require('express');

module.exports = {
  initiate: async (emailAddress) => {
    const doesExist = await crud.passwordResetRequestAlreadyExists(emailAddress);
    if (doesExist.result === false) {
      const hash = uuidv4();

      // Create a password recovery document / record for MongoDB
      const recoveryObject = {
        email: emailAddress,
        hash: hash
      }

      // Send a recovery email
      const result = await sendPasswordResetEmail(emailAddress, hash);
      console.log('result from mailer', result);
      if (result) {
        // Insert into mongo
        await crud.insertRecoveryRecordIntoDatabase(recoveryObject);
        return { success: true, message: result }

      } else {
        console.log("Line 28 Problem sending e-mail")
        return { success: false, message: "There was a problem sending recovery e-mail." }
      }

    } else {
      return { success: false, message: `Request for ${emailAddress}: ${doesExist.message}` }; // Not successful
    }
  },

  authenticateEmailRecoveryRequest: async (hash, hashedEmail) => {
    try {
      const record = await crud.getRecordByHash(hash);
      if (record) {
        const isHashVerified = await verifyHashedEmail(record, hashedEmail)
        if (isHashVerified === true) {
          // Make sure it's not expired
          return isRequestWithinExpiryDate(record) ?
            { success: true, message: "Request is valid." } : { success: false, message: "Request expired. Please try completing a new request." }
        } else {
          return { success: false, message: "Unable to verify hash." }
        }
      } else {
        return { success: false, message: "Database returned no result." }
      }
    } catch (exception) {
      console.log(exception)
    }
  },

  /**
   * This will hit the psql database, update the user's password. If successful
   * Hit the MongoDB and claim the request
   * @param {object} data
   * @param {string} data.emailHash
   * @param {string} data.recoveryHash
   * @param {string} data.passwordText1
   */
  doPasswordUpdate: async (data) => {
    const record = await crud.getRecordByHash(data.recoveryHash);

    if (record) {
      if (record.claimed === false) {
        const updatePackage = {
          forUser: record.email,
          first_password: data.passwordText1,
          second_password: data.passwordText1
        }

        try {
          await db.updateUserPassword(updatePackage);
          // This this is successful, update the mongo record
          record.claimed = true;
          await record.save();
        } catch (exception) {
          console.log(exception);
        }
      } else {
        return Promise.reject("Request is already claimed")
      }
    } else {
      return Promise.reject("Record not found");
    }
  }
}

async function verifyHashedEmail(record, hashedEmailValue) {
  assert(record.email, "E-mail field doesn't exist on record.");
  return await crypto.genericCompare(record.email, hashedEmailValue);
}

function isRequestWithinExpiryDate(record) {
  const requestStillValid = moment().isBefore(record.expiryDate);
  return requestStillValid;
}
