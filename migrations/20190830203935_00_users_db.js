
exports.up = function(knex) {
  return knex.schema.createTable('user', (table) => {
		table.increments('id');
		table.string('email');
		table.string('password');
		table.boolean('is_registered').defaultTo(true);
		table.dateTime('created_at').notNullable();
	})
	.then(()=> {
		console.log("users table created");
	});
};

exports.down = function(knex) {
  return knex.schema.dropTable('user');
};
