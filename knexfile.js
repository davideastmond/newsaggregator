// Update with your config settings.
require('dotenv').config();
module.exports = {
  client: 'pg',
  pool: {
    min: 2,
    max: 10
  },
  connection: {
    host: 'localhost',
    port: 5432,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    charset: 'utf7'
    },
    migrations: {
	directory: __dirname + '/migrations',
    },
    seeds: {
	directory: __dirname + '/seeds',	
    },
  
};
