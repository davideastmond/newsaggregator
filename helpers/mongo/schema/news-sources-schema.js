const mongoose = require('mongoose');

const newsSourcesSchema = new mongoose.Schema({
  email: String,
  lastUpdated: Date,
  whiteList: [String], // POIJ - might be a better data structure for this feature
})

userPasswordRecovery = mongoose.model('sources', newsSourcesSchema)
module.exports = userPasswordRecovery;
