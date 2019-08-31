
exports.up = function(knex) {
  return knex.schema.createTable('user', (table) => {
		table.increments('id');
		table.string('email').unique().notNullable();
		table.string('password');
		table.boolean('is_registered').defaultTo(true);
		table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
	})
	.then(()=> {
		console.log("users table created");
	});
};

exports.down = function(knex) {
  return knex.schema.dropTable('user');
};
