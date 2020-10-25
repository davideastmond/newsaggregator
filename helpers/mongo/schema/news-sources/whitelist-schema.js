const mongoose = require('mongoose');

module.exports = {
  whitelistSourcesSchema = new mongoose.Schema({
    topic: { type: String, default: null },
    domains: [String]
  })
}
