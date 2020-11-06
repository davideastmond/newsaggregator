const mongoose = require('mongoose');
const dayjs = require('dayjs');

const userPasswordRecoverySchema = new mongoose.Schema({
  email: String,
  hash: String,
  claimed: {
    type: Boolean,
    default: false
  },
  requestDate: {
    type: Date,
    default: new Date()
  },
  expiryDate: {
    type: Date,
    default: dayjs().add(parseInt(process.env.PASSWORD_RECOVERY_EXPIRY_MINUTES), 'minutes')
  }
})

userPasswordRecovery = mongoose.model('user_recovery', userPasswordRecoverySchema)
module.exports = userPasswordRecovery;
