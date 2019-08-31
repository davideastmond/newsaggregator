require('dotenv').config();
exports.dbConnectString =  {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_USER_PASSWORD,
    database: process.env.DB_NAME
  }
};

const knex = require('knex')(exports.dbConnectString);
module.exports = {
  createTableExample: () => {
    knex.schema.createTable('cars', (table) => {
      table.increments('id');
      table.string('name');
      table.integer('price')})
      .then(() => console.log("table created"))
      .catch((err) => { console.log(err); throw err })
      .finally(() => {
          knex.destroy();
      });
  }
};