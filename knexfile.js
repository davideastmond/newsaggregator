// Update with your config settings.
require('dotenv').config();

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
     	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_USER_PASSWORD,
	database: process.env.DB_NAME,
	charset: 'utf7'
    },
    migrations: {
	directory: __dirname + '/migrations',
    },
    seeds: {
	directory: __dirname + '/seeds',	
    },
  },
};
