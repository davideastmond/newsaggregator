const mongoose = require('mongoose');
const { whitelistSource } = require('./whitelist-schema')

const newsSourcesSchema = new mongoose.Schema({
  email: String,
  lastUpdated: Date,
  whiteList: [whitelistSource], // POIJ - might be a better data structure for this feature
})

userPasswordRecovery = mongoose.model('sources', newsSourcesSchema)
module.exports = userPasswordRecovery;
