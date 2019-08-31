// Update with your config settings.
require('dotenv').config();
module.exports = {
  development: {
    client: 'pg',
    connection: {
			host: process.env.DB_HOST,
					user: process.env.DB_USER,
					password: process.env.DB_USER_PASSWORD,
					database: process.env.DB_NAME
		}
  },
};
