const bcrypt = require('bcrypt');
require('dotenv').config();

module.exports = {
  doMultipleQueries: function(queryString) {
    /* 
    If the user has provided a comma-separated query, extract it and make it into an array
    */

    throw Error("Not implemented.");
    
    
  },
  
  hashPassword: function(rawPassword) {
    return bcrypt.hashSync(rawPassword, 10);
  }
};