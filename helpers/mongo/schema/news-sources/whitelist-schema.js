const mongoose = require('mongoose');

module.exports = {
  whitelistSource: new mongoose.Schema({
    topic: { type: String, default: null },
    domains: [String]
  })
}
