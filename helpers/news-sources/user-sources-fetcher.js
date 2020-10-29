const mongoose = require('mongoose')
const mod = require('../mongo/schema/news-sources/news-sources-schema')

module.exports = {
  findSourcesForUser: async (email) => {
    return await mod.findOne({ email })
  }
}
