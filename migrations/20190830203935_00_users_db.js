
exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('user', (table) => {
      table.increments('id').primary();
      table.string('email').unique().notNullable();
      table.string('password');
      table.boolean('is_registered').defaultTo(true);
      table.boolean('has_chosen_topics').defaultTo(true);
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('last_login').defaultTo(knex.fn.now());
    }),
    knex.schema.createTable('topic', (table) => {
      table.increments('id').primary();
      table.string('name').unique().notNullable();
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    }),
    knex.schema.createTable('user_topic', (table) => {
      table.increments('id').primary();
      table.integer('user_id');
      table.integer('topic_id');
      table.foreign('user_id').references('user.id');
      table.foreign('topic_id').references('topic.id');
		}),
		knex.schema.createTable('article', (table) => {
			table.increments('id').primary();
			table.string('url');
		}),
		knex.schema.createTable('user_article', (table) => {
			table.increments('id').primary();
			table.integer('article_id');
			table.integer('user_id');
			table.foreign('article_id').references('article.id');
			table.foreign('user_id').references('user.id');
		})
  ]);
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('user_topic'),
    knex.schema.dropTable('user'),
		knex.schema.dropTable('topic'),
		knex.schema.dropTable('article'),
		knex.schema.dropTable('user_article')
  ]);
};
