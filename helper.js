const bcrypt = require('bcrypt');
require('dotenv').config();

module.exports = {
  doMultipleQueries: function(queryString) {
    /* 
    If the user has provided a comma-separated query, extract it and make it into an array
    */

    throw Error("Not implemented.");
    
    
  },
	
	passwordMeetsSecurityRequirements: (rawPassword) => {
		const regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/;
  	return regEx.test(rawPassword);
	},

  hashPassword: function(rawPassword) {
    return bcrypt.hashSync(rawPassword, parseInt(process.env.SALT_ROUNDS));
  },
  hashPasswordAsync: function(rawPassword) {
    return bcrypt.hash(rawPassword, parseInt(process.env.SALT_ROUNDS));
  }
};