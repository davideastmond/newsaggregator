const mongoose = require('mongoose');
require('dotenv').config();

let database;
module.exports = {
  connect: function() {
    if (database) return;
    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    database = mongoose.connection;

    database.once('open', async () => {
      console.log('Connected to database');
    });

    database.on('error', () => {
      console.log('Error connecting to database');
    });
  },

  disconnect: function() {
    if (!database) return;
    mongoose.disconnect();
    console.log('Disconnected from database');
  },
};
