const mongoose = require('mongoose');
const { whitelistSource } = require('./whitelist-schema')
const FILTER_TYPE = require('./filter-type-enum')
const newsSourcesSchema = new mongoose.Schema({
  email: String,
  lastUpdated: {
    type: Date,
    default: new Date()
  },
  filterType: {
    type: Number,
    default: FILTER_TYPE.NONE
  },
  whiteList: { type: [whitelistSource], default: [] }, // POIJ - might be a better data structure for this feature
})

const newsSourceModel = mongoose.model('sources', newsSourcesSchema)
module.exports = newsSourceModel
