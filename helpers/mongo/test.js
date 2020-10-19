const crudFunction = require('./crud');
const db = require('./db');

async function testCrud() {
  const testModel = {
    email: "testemail@gmail.com",
    hash: "sa92i3jf9sj20d9sdf",
  }
  db.connect();
  const result = await crudFunction.insertRecoveryRecordIntoDatabase(testModel);
  console.log(result)
}

testCrud();
