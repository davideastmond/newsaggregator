const mongoose = require('mongoose');

module.exports = {
  whiteListStructureSchema = new mongoose.Schema({
    topic: { type: String, default: null },
    domains: [String]
  })
}
