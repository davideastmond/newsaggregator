/* eslint-disable max-len */
const functionHelpers = require('../helpers/helper/helper.js');
require('dotenv').config();
exports.seed = function(knex) {
  // Delete ALL Existing entries from each table
  return Promise.all([
    knex('user_topic').del(),
    knex('user').del(),
    knex('topic').del(),
    knex('article').del(),
    knex('user_article').del(),
  ])
      .then(()=> {
        return Promise.all([
          knex('user').insert({ id: 1, email: 'email@email.com', password: functionHelpers.hashPassword(process.env.TEST_PASSWORD), is_registered: true, has_chosen_topics: true }),
          knex('user').insert({ id: 2, email: 'email1@email.com', password: functionHelpers.hashPassword(process.env.TEST_PASSWORD), is_registered: true, has_chosen_topics: true }),
          knex('user').insert({ id: 3, email: 'email2@email.com', password: functionHelpers.hashPassword(process.env.TEST_PASSWORD), is_registered: true, has_chosen_topics: true }),
        ])
            .then(()=> {
              return Promise.all([
                knex('topic').insert({ id: 1, name: 'politics' }),
                knex('topic').insert({ id: 2, name: 'sports' }),
                knex('topic').insert({ id: 3, name: 'science' }),
                knex('topic').insert({ id: 4, name: 'reading' }),
                knex('topic').insert({ id: 5, name: 'education' }),
                knex('topic').insert({ id: 6, name: 'technology' }),
                knex('topic').insert({ id: 7, name: 'space' }),
                knex('topic').insert({ id: 8, name: 'music' }),
                knex('topic').insert({ id: 9, name: 'broadway' }),
                knex('topic').insert({ id: 10, name: 'law' }),
              ])
                  .then(()=> {
                    return Promise.all([
                      knex('user_topic').insert({ id: 1, user_id: 1, topic_id: 1 }),
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

                      knex('user_topic').insert({ id: 13, user_id: 3, topic_id: 9 }),
                    ]);
                  })
                  .then(()=> {
                    return Promise.all([
                      knex('article').insert({ id: 1,
                        url: 'https://www.cnn.com/2019/10/05/media/tucker-carlson-op-ed-ukraine-trump-impeachment/index.html',
                        headline: 'Tucker Carlson says Trump\'s Ukraine call was inappropriate: \'There\'s no way to spin this\'',
                        image_src: 'https://img.thedailybeast.com/image/upload/c_crop,d_placeholder_euli9k,h_360,w_640,x_0,y_0/dpr_2.0/c_limit,w_740/fl_lossy,q_auto/v1570372090/meet-press_9_gvkaez' }),
                      knex('article').insert({ id: 2, url: 'https://www.cbsnews.com/news/trump-administration-to-deny-visas-to-immigrants-who-cant-prove-they-can-pay-for-health-care/',
                        headline: 'Trump administration to deny visas to immigrants who can\'t prove they can pay for health care',
                        image_src: 'https://cbsnews3.cbsistatic.com/hub/i/r/2019/08/12/07ba317f-a024-456f-a85c-3d79a0fed449/thumbnail/1280x720/4775949ae1dd8365c77e674b14a4618b/cbsn-fusion-public-charge-rule-cracks-down-on-government-benefits-for-legal-immigrants-thumbnail-1910310-640x360.jpg' }),
                    ]);
                  })
                  .then(()=> {
                    return Promise.all([
                      knex('user_article').insert({ id: 1, user_id: 1, article_id: 1 }),
                      knex('user_article').insert({ id: 2, user_id: 1, article_id: 2 }),
                    ]);
                  })
                  .then(() => {
                    return Promise.all([
                      knex.raw('ALTER SEQUENCE topic_id_seq RESTART WITH 11;'),
                      knex.raw('ALTER SEQUENCE user_topic_id_seq RESTART WITH 14;'),
                      knex.raw('ALTER SEQUENCE user_id_seq RESTART WITH 4;'),
                      knex.raw('ALTER SEQUENCE article_id_seq RESTART WITH 3;'),
                      knex.raw('ALTER SEQUENCE user_article_id_seq RESTART WITH 3;'),
                    ]);
                  });
            });
      });
};
