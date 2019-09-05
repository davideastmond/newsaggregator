const functionHelpers = require('../helper');

// exports.seed = function(knex) {
//   // Deletes ALL existing entries
//   return knex('table_name').del()
//     .then(function () {
//       // Inserts seed entries
//       return knex('table_name').insert([
//         {id: 1, colName: 'rowValue1'},
//         {id: 2, colName: 'rowValue2'},
//         {id: 3, colName: 'rowValue3'}
//       ]);
//     });
// };

exports.seed = function(knex) {
  // Delete ALL Existing entries from each table
  return Promise.all([
		knex('user_topic').del(),
    knex('user').del(),
    knex('topic').del()
  ])
  .then(()=> {
    return Promise.all([
      knex('user').insert({ id: 1, email: 'email@email.com', password: functionHelpers.hashPassword('Password$4'), is_registered: true, has_chosen_topics: true }),
      knex('user').insert({ id: 2, email: 'email1@email.com', password: functionHelpers.hashPassword('Password$4'), is_registered: true, has_chosen_topics: true }),
      knex('user').insert({ id: 3, email: 'email2@email.com', password: functionHelpers.hashPassword('Password$4'), is_registered: true, has_chosen_topics: true })
    ])
    .then(()=> {
      return Promise.all([
        knex('topic').insert({ id: 1, name: 'politics'}),
        knex('topic').insert({ id: 2, name: 'sports'}),
				knex('topic').insert({ id: 3, name: 'science'}),
				knex('topic').insert({ id: 4, name: 'reading'}),
				knex('topic').insert({ id: 5, name: 'education'}),
				knex('topic').insert({ id: 6, name: 'technology'}),
				knex('topic').insert({ id: 7, name: 'space'}),
				knex('topic').insert({ id: 8, name: 'music'}),
				knex('topic').insert({ id: 9, name: 'broadway'}),
				knex('topic').insert({ id: 10, name: 'law'})
      ])
      .then(()=> {
        return Promise.all([
          knex('user_topic').insert({ id: 1, user_id: 1, topic_id: 1}),
          knex('user_topic').insert({ id: 2, user_id: 1, topic_id: 2 }),
					knex('user_topic').insert({ id: 3, user_id: 1, topic_id: 3 }),
					knex('user_topic').insert({ id: 4, user_id: 1, topic_id: 4 }),
					knex('user_topic').insert({ id: 5, user_id: 1, topic_id: 5 }),
					knex('user_topic').insert({ id: 6, user_id: 1, topic_id: 6 }),
					knex('user_topic').insert({ id: 7, user_id: 1, topic_id: 7 }),
					knex('user_topic').insert({ id: 8, user_id: 1, topic_id: 8 }),
					knex('user_topic').insert({ id: 9, user_id: 1, topic_id: 9 }),
					knex('user_topic').insert({ id: 10, user_id: 1, topic_id: 10 }),

          knex('user_topic').insert({ id: 11, user_id: 2, topic_id: 1 }),
          knex('user_topic').insert({ id: 12, user_id: 2, topic_id: 2 }),

          knex('user_topic').insert({ id: 13, user_id: 3, topic_id: 9 })
        ]);
      });
    });
  });
};