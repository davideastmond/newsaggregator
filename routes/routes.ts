const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const axios = require('axios');
const helperFunctions = require('../dist/src/helpers/helper');
const { check } = require('express-validator');
const cache = require('memory-cache');
import { strip } from "../src/helpers/cache"
const cacheFunctions = require('../dist/src/helpers/cache');
const dbFunctions = require('../dist/src/helpers/db');

export default router;

router.get('/', (req, res) => {
  if (req.session.session_id) {
    res.render('home.ejs', { logged_in: true, uId: req.session.session_id });
  } else {
    res.render('home.ejs', { logged_in: false, uId: null });
  }
});

router.get('/news', async (req, res) => {
  const reqDate = req.query.date;
  const reqQuery = req.query.newsQuery;
  // eslint-disable-next-line max-len
  const url = `https://newsapi.org/v2/everything?q=${reqQuery}&from=${reqDate}&sortBy=publishedAt&apiKey=${process.env.PERSONAL_API_KEY}&pageSize=30&language=en`;
  /* Create an API URI based on received info, query the URI,
  get a response, and send that data to render in news.ejs view */

  let loggedInState = false;
  let cacheData = [];

  if (req.session.session_id) {
    loggedInState = true;
    if (cache.get(req.session.session_id)) {
      cacheData = cacheFunctions.strip(cache.get(req.session.session_id));
    }
  }

  try {
    const response = await axios.get(url);
    if (cacheData === [] && loggedInState) {
      // hit the database
      const bookmarkResponses = await dbFunctions
          .getBookmarks({ email: req.session.session_id });
      cacheData = cacheFunctions.strip(bookmarkResponses);
      res.render('news.ejs', { loggedIn: loggedInState,
        bookmarkCache: cacheData,
        articles: response.data.articles,
        searchQuery: reqQuery, uId: req.session.session_id,
        requestDate: reqDate, count: response.data.articles.length,
        logged_in: req.session.session_id || false });
    } else {
      res.render('news.ejs', { loggedIn: loggedInState,
        bookmarkCache: cacheData,
        articles: response.data.articles,
        searchQuery: reqQuery,
        uId: req.session.session_id,
        requestDate: reqDate,
        count: response.data.articles.length,
        logged_in: req.session.session_id || false });
    }
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

router.get('/headlines', async (req, res)=> {
  req.session.session_id ? loggedIn = true : loggedIn = false;
  let url;
  req.query.country ?
    // eslint-disable-next-line max-len
    url = `https://newsapi.org/v2/top-headlines?sources=associated-press&apiKey=${process.env.PERSONAL_API_KEY}&pageSize=30&language=en` :
    // eslint-disable-next-line max-len
    url = `https://newsapi.org/v2/top-headlines?sources=google-news&apiKey=${process.env.PERSONAL_API_KEY}&pageSize=30&language=en`;

  try {
    const response = await axios.get(url);
    const strippedCache = strip(cache.get(req.session.session_id));
    res.render('headlines.ejs', { articles: response.data.articles,
      bookmarkCache: strippedCache,
      uId: req.session.session_id,
      loggedIn: loggedIn,
      count: response.data.articles.length,
      country: req.query.country || 'us',
      logged_in: req.session.session_id || false });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error, message: 'Unable to retrieve' });
  }
});

router.get('/login', (req, res) => {
  if (!req.session.session_id) {
    res.render('login.ejs', { message: null });
  } else {
    // Sends user to dashboard if already logged in
    res.status(200).send({ response: 'send to dashboard ' });
  }
});

router.get('/register', (req, res) => {
  res.render('register.ejs');
});

router.get('/user/:id/feed', async (req, res) => {
  if (req.session.session_id) {
    /* This function queries the database and grabs all of the saved topics for the user.
      With the resulting data it will query the newsAPI for each topic.
    */

    try {
      const resultingData = await dbFunctions
          .getUserTopics({ email: req.session.session_id });
      const fetchResults = await helperFunctions
          .doTopicsAxiosFetchRequest({ userTopics: resultingData,
            db_id: req.session.database_id });
      const listTopics = resultingData.map((resultElement) => {
        return resultElement.name;
      });
      /* Once we get our results, we need to render the page for the user
        We'll also pull from the cached bookmarks
        incase there are any articles in the feed that are bookmarked. */
      const dataArticles = helperFunctions.compileAPIFetchData(fetchResults);
      const strippedCache = cacheFunctions.strip(cache.get(req.session.session_id));
      const flattenedArticlesArray = dataArticles.flat();

      const filteredArticleData = Array.from(new Set(flattenedArticlesArray));
      res.render('feed.ejs', { topics_list: listTopics, uId: req.session.session_id,
        data: resultingData,
        arrayCount: filteredArticleData.length,
        data_articles: filteredArticleData,
        bookmarkCache: strippedCache } );
    } catch (error) {
      console.log(error);
    }
  } else {
    res.redirect('/login');
  }
});

router.get('/user/:id/topics', async (req, res) => {
  if (req.session.session_id) {
    /*
    This is the topics configuration page.
    This route needs to hit the database and
    pull all of the topics associated with the user
    We plug the results into the ejs view variable for display.
    */
    const result = await dbFunctions.getUserTopics({ email: req.session.session_id });
    res.render('topics.ejs', { email: req.params.id,
      topics: result,
      logged_in: true,
      uId: req.session.session_id });
  } else {
    res.redirect('/login');
  }
});

router.get('/user/:id/profile', (req, res) => {
  /*
  This route will display the user's profile page.
  It will allow the user to change their password and add/delete news topics
  */
  if (req.session.session_id) {
    res.render('profile.ejs', { uId: req.session.session_id });
  } else {
    res.redirect('/login');
  }
});

router.get('/user/:id/bookmarks', async (req, res) => {
  if (req.session.session_id) {
    // First we need to access the DB and get all saved articles for the user
    try {
      const response = await dbFunctions.getBookmarks({ email: req.session.session_id });
      res.render('bookmarks.ejs', { uId: req.session.session_id, data: response });
    } catch (err) {
      res.response(400).json({ message: 'Server Error' });
    }
  } else {
    res.redirect('/');
  }
});

router.put('/user/:id/profile',
    [check('pwdone')
        .trim().escape(),
    check('pwdtwo').trim()
        .escape()], async (req, res) => {
      if (req.session.session_id) {
        try {
          await dbFunctions
              .updateUserPassword({ forUser: req.session.session_id,
                first_password: req.body.pwdone,
                second_password: req.body.pwdtwo });
          res.status(200).json({ status: 'ok', newURL: '#' });
        } catch (error) {
          res.status(400).json({ error: error.error,
            message: 'Unable to update the password' });
        }
      } else {
        res.redirect('/login');
      }
    });

router.put('/user/:id/topics', async (req, res) => {
  if (req.session.session_id) {
    /* This route is responsible for updating the DB
    with the changes to a user's topics subscription. */
    const updateData = { email: req.session.session_id,
      database_id: req.session.database_id,
      topicArray: JSON.parse(req.body.topics) };
    /* We have an array of new topics for the user.
    We need to hit the database. Reference by email */
    try {
      await dbFunctions.updateTopicListForUser(updateData);
      res.status(200).json({ response: 'ok' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: 'unable to update the database' });
    }
  } else {
    res.redirect('/');
  }
});

router.post('/register', [check('emailAddr').isEmail().trim().escape(),
  check('passwordOne').trim().escape(),
  check('passwordTwo').trim().escape()], async (req, res) => {
  if (req.session.session_id) {
    res.status(400).send({ response: 'user should log out first before registering' });
    return;
  }

  try {
    const result = await dbFunctions
        .registerUser({ email: req.body.emailAddr,
          first_password: req.body.passwordOne,
          second_password: req.body.passwordTwo,
          is_registered: true });
    req.session.session_id = result.response[0].email;
    req.session.database_id = result.response[0].id;
    res.status(200).json({ response: `/user/${req.session.session_id}/topics` });
  } catch (error) {
    res.status(400).send({ error: `${error}` });
  }
});

router.post('/login',
    [check('email').isEmail().trim().escape(),
      check('password').trim().escape()], async (req, res) => {
      /* After the user logs in, we set a cookie and forward the user to their
      landing page - which user users/:id/feed.
    We retrieve their bookmarks, store it in cache. */
      const timeStamp = new Date();
      const verificationObject = { email: req.body.email,
        password: req.body.password,
        last_login: timeStamp };

      try {
        const result = await dbFunctions.verifyLogin(verificationObject);
        req.session.session_id = req.body.email;
        req.session.database_id = result.db_id;
        try {
          const bookmarkData = await dbFunctions
              .getBookmarks({ email: req.session.session_id });
          cache.put(req.session.session_id, bookmarkData);
          res.redirect(`/user/${req.session.session_id}/feed`);
        } catch (_) {
          res.redirect(`/user/${req.session.session_id}/feed`);
        }
      } catch (err) {
        res.render('login.ejs', { message: err });
      }
      // eslint-disable-next-line indent
});

router.post('/user/:id/bookmarks', async (req, res) => {
  /* This handles updating of saved/favourite
  articles for logged in users via a POST request.
    We add a bookmark for the user and then update a cache
    that stores the user's bookmarks. That way, when a user visits a
    headlines or topics page
    that has a bookmarked article therin, the article entry will show as being
    bookmarked with a cute little red bookmark ^_^
  */

  if (req.session.session_id) {
    const articleUpdatePackage = { user_id: req.session.session_id,
      database_id: req.session.database_id,
      url: req.body.url,
      headline: req.body.headlineText,
      thumbnail: req.body.imageSrc };
    try {
      const result = await dbFunctions.addBookmarkForUser(articleUpdatePackage);
      if (result.response) {
        cache.put(req.session.session_id, result.response);
        res.status(200).json({ response: 'ok' });
      } else {
        res.status(400).json({ status: 'error updating database' });
      }
    } catch (error) {
      res.status(400).json({ status: 'error updating database' });
    }
  } else {
    res.redirect('/');
  }
});


// Deletes a bookmarked favorite for a logged-in user
router.delete('/user/:id/bookmarks/:id', async (req, res) => {
  if (req.session.session_id) {
    const bookmarkObject = { email: req.session.session_id,
      user_id: req.session.database_id,
      url_to_delete: req.body.url };
    try {
      const result = await dbFunctions.deleteBookmarkForUser(bookmarkObject);
      cache.put(req.session.session_id, result.result);
      res.status(200).json({ response: 'ok' });
    } catch (err) {
      res.status(400).json({ response: 'error' });
    }
  }
});

router.delete('/user/:id/bookmarks', async (req, res) => {
  if (req.session.session_id) {
    const bookmarkObject = { email: req.session.session_id,
      user_id: req.session.database_id };
    const result = await dbFunctions.deleteAllBookmarksForUser(bookmarkObject);
    cache.put(req.session.session_id, result.result);
    res.status(200).json({ response: 'ok' });
  } else {
    res.status(404).json( { response: 'not authorized' });
  }
});

router.post('/logout', (req, res) => {
  req.session.session_id = null;
  console.log('LOGOUT MESSAGE', req.body.data);
  res.render('home.ejs', { logged_in: false, uId: null });
});

// eslint-disable-next-line no-extend-native
Object.defineProperty(Array.prototype, 'flat', {
  value: function(depth = 1) {
    return this.reduce(function(flat, toFlatten) {
      return flat.concat((Array.isArray(toFlatten) && (depth > 1)) ?
      toFlatten.flat(depth - 1) : toFlatten);
    }, []);
  },

});
