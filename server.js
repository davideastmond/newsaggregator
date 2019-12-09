const express = require('express');
require('dotenv').config();
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const PORT = 6565;
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const helperFunctions = require('./helper');
const { check, validationResult } = require('express-validator');
const cache = require('memory-cache');
const cacheFunctions = require('./cache');
const dbFunctions = require("./db");

const cookieKeys = [process.env.COOKIE_KEYS];
// Middle-ware
app.use(cookieParser());
app.use(cookieSession({
  name: process.env.COOKIE_SESSION,
  keys: cookieKeys,
  maxAge: 600000 // 5 minutes
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'scripts'))); 
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user/:id/topics', express.static(path.join(__dirname, 'scripts')));
app.use('/user/:id/topics', express.static(path.join(__dirname, 'public')));

app.use('/user/:id/feed', express.static(path.join(__dirname, 'scripts')));
app.use('/user/:id/feed', express.static(path.join(__dirname, 'public')));

app.use('/user/:id/profile', express.static(path.join(__dirname, 'scripts')));
app.use('/user/:id/profile', express.static(path.join(__dirname, 'public')));

app.use('/user/:id/bookmarks', express.static(path.join(__dirname, 'scripts')));
app.use('/user/:id/bookmarks', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');


// Get Requests
app.get("/", (req, res) => {
  
  if (req.session.session_id) {
    res.render('home.ejs', { logged_in: true, uId: req.session.session_id });
  } else {
    res.render('home.ejs', { logged_in: false, uId: null});
  }
});

app.get("/news", async (req, res) => {
  // Obtain the query parameters to be used for a API fetch request
  const reqDate = req.query.date;
  const reqQuery = req.query.newsQuery;
  const url = `https://newsapi.org/v2/everything?q=${reqQuery}&from=${reqDate}&sortBy=publishedAt&apiKey=${process.env.PERSONAL_API_KEY}&pageSize=20&language=en`;
    // Create an API URI based on received info, query the URI, get a response, and send that data to render in news.ejs view
  
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
      const bookmarkResponses = await dbFunctions.getBookmarks({ email: req.session.session_id});
      cacheData = cacheFunctions.strip(bookmarkResponses);
      res.render('news.ejs', { loggedIn: loggedInState,  
        bookmarkCache: cacheData, 
        articles: response.data.articles, 
        searchQuery: reqQuery,  uId: req.session.session_id, 
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
  } catch(error) {
    res.status(400).send({ error: error });
  }
});

app.get("/headlines", async (req, res)=> {
  // Grab the date
  req.session.session_id ? loggedIn = true : loggedIn = false;
  let url;
  req.query.country ? 
    url = `https://newsapi.org/v2/top-headlines?sources=google-news&apiKey=${process.env.PERSONAL_API_KEY}&pageSize=20&language=en`: url = `https://newsapi.org/v2/top-headlines?sources=google-news&apiKey=${process.env.PERSONAL_API_KEY}&pageSize=20&language=en`;

  try { 
    const response = await axios.get(url);
    const strippedCache = cacheFunctions.strip(cache.get(req.session.session_id));
    res.render('headlines.ejs', { articles: response.data.articles, 
      bookmarkCache: strippedCache, 
      uId: req.session.session_id, 
      loggedIn: loggedIn, 
      count: response.data.articles.length, 
      country: req.query.country || "us", 
      logged_in: req.session.session_id || false });
  } catch (error) {
    res.status(400).send({ error: error, message: "Unable to retrieve" });
  } 
});

app.get("/login", (req, res) => {
  if (!req.session.session_id) {
    res.render('login.ejs', { message: null });
  } else {
    // They should be sent to dashboard
    res.status(200).send({ response: 'send to dashboard ' });
  }
});

app.get("/register", (req, res) => {
  res.render('register.ejs');
});

app.get('/user/:id/feed', async (req, res) => {
  if (req.session.session_id) {
    /* This function queries the database and grabs all of the saved topics for the user.
      With the resulting data it will query the newsAPI for each topic. 
    */
    
    try {
      const resultingData = await dbFunctions.getUserTopics({ email: req.session.session_id });
      const fetchResults = await helperFunctions.doTopicsAxiosFetchRequest({ userTopics: resultingData, db_id: req.session.database_id });
      const listTopics = resultingData.map((resultElement) => {
        return resultElement.name;
      });
      // Once we get our results, we need to render the page for the user
        // We'll also pull from the cached bookmarks incase there are any articles in the feed that are bookmarked.
        const dataArticles = helperFunctions.compileAPIFetchData(fetchResults);
        const strippedCache = cacheFunctions.strip(cache.get(req.session.session_id));
        const flattenedArticlesArray = dataArticles.flat();
        // Here we'll perform a test on the variable 'flattenedArticlesArray' to see if there are duplicate headlines
        const filteredArticleData = helperFunctions.getDuplicatesFromArticleArray(flattenedArticlesArray);
        res.render('feed.ejs', { topics_list: listTopics, uId: req.session.session_id, 
          data: resultingData, 
          arrayCount: filteredArticleData.length, 
          data_articles: filteredArticleData, 
          bookmarkCache: strippedCache } );
    } catch (error) {
      console.log(error);
    }
  } else {
    res.redirect("/login");
  }
});

app.get('/user/:id/topics', async (req, res) => {
  if (req.session.session_id) {
    /* 
    This is the topics configuration page.
    This route needs to hit the database and pull all of the topics associated with the user
    We plug the results into the ejs view variable for display.
    */
    const result = await dbFunctions.getUserTopics({ email: req.session.session_id });
    res.render('topics.ejs', { email: req.params.id, topics: result, logged_in: true, uId: req.session.session_id });
  } else {
    res.redirect('/login');
  }
});

app.get('/user/:id/profile', (req, res) => {
  /* 
  This route will display the user's profile page. It will allow the user to change their password and add/delete news topics
  */
  if (req.session.session_id) {
    res.render('profile.ejs', { uId: req.session.session_id });
  } else {
    res.redirect('/login');
  }
});

app.get('/user/:id/bookmarks', async (req, res) => {
  if (req.session.session_id) {
    // First we need to access the DB and get all saved articles for the user
    try  {
      const response = await dbFunctions.getBookmarks({ email: req.session.session_id });
      res.render('bookmarks.ejs', { uId: req.session.session_id, data: response });
    } catch(err) {
      res.response(400).json({ message: 'Server Error' });
    }
  } else {
    res.redirect('/');
  }
});

app.post('/user/:id/profile/update',[check('pwdone').trim().escape(), check('pwdtwo').trim().escape()], async (req, res) => {
  // This route handles password changes
  
  if (req.session.session_id) {
    // Database request. This essentially updates the user's password
    try {
      await dbFunctions.updateUserPassword({ forUser: req.session.session_id, first_password: req.body.pwdone, 
        second_password: req.body.pwdtwo });
      res.status(200).json({ status: 'ok', newURL: "#"});
    } catch(error) {
      res.status(400).json({ error: error.error, message: 'Unable to update the password ' });
    }
  } else {
    res.redirect('/login');
  }
});

app.post('/user/:id/topics/update', async (req, res) => {
  if (req.session.session_id) {
    // This route is responsible for updating the DB with the changes to a user's topics subscription.
    const updateData = { email: req.session.session_id, database_id: req.session.database_id, topicArray: JSON.parse(req.body.topics) };
    // We have an array of new topics for the user. We need to hit the database. Reference by email
    try {
      await dbFunctions.updateTopicListForUser(updateData);
      res.status(200).json({ response: 'ok' });
    } catch (error) {
      res.status(500).json({ status: 'unable to update the database' });
    }
  } else {
    res.redirect("/");
  }
});

// Receiving sign-up data.
app.post("/register", [check('emailAddr').isEmail().trim().escape(), 
  check('passwordOne').trim().escape(),
  check('passwordTwo').trim().escape()], async (req, res) => {
  
  // If there is a current session, user must log out
  if (req.session.session_id) {
    res.status(400).send({ response: 'user should log out first before registering'});
    return;
  }

  try {
    const result = await dbFunctions.registerUser({ email: req.body.emailAddr, first_password: req.body.passwordOne, 
      second_password: req.body.passwordTwo,
      is_registered: true});
    req.session.session_id = result.response[0].email;
    req.session.database_id = result.response[0].id;
    res.status(200).json({ response: `/user/${req.session.session_id}/topics` });
  } catch(error) {
    res.status(400).send({ error: error.message, message: 'Error registering user'});
  }
});

app.post("/login", [check('email').isEmail().trim().escape(), check('password').trim().escape()], async (req, res) => {
  /* After the user logs in, we set a cookie and forward the user to their landing page - which user users/:id/feed.
    We retrieve their bookmarks, store it in cache. */
  const timeStamp = new Date();
  const verificationObject = { email: req.body.email, password: req.body.password, last_login: timeStamp};

  try {
    const result = await  dbFunctions.verifyLogin(verificationObject);
    if (result.success) {
      req.session.session_id = req.body.email;
      req.session.database_id = result.db_id;
      try {
        const bookmarkData = await dbFunctions.getBookmarks({ email: req.session.session_id });
        cache.put(req.session.session_id, bookmarkData);
        res.redirect(`/user/${req.session.session_id}/feed`);
      } catch (_) {
        res.redirect(`/user/${req.session.session_id}/feed`);
      }
    } else {
      res.render('login.ejs', { message: "Invalid username / password" });
    }
  } catch(err) {
    res.render('login.ejs', { message: err.response });
  }
});

app.post("/user/:id/bookmarks/add", async (req, res) => {
  /* This handles updating of saved/favourite articles for logged in users via a POST request.
    We add a bookmark for the user and then update a cache that stores the user's bookmarks. That way, when a user visits a headlines or topics page
    that has a bookmarked article therin, the article entry will show as being bookmarked
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
        res.status(200).json({ response: "ok"});
      } else {
        res.status(400).json({ status: 'error updating database'});
      }
    } catch(error) {
      //console.log(error);
      res.status(400).json({ status: 'error updating database'});
    }
  } else {
    res.redirect("/");
  }
});

app.post('/user/:id/bookmarks/:id/delete', async (req, res) => {
  // Deletes a bookmarked favorite for a logged-in user
  
  if (req.session.session_id) {
    const bookmarkObject = { email: req.session.session_id, user_id: req.session.database_id, url_to_delete: req.body.url };
    try {
      const result = await dbFunctions.deleteBookmarkForUser(bookmarkObject);
      cache.put(req.session.session_id, result.result);
      res.status(200).json({ response: 'ok'});
    } catch(err) {
      res.status(400).json({ response: 'error' });
    }
  }
});

app.post('/user/:id/bookmarks/delete', async (req, res) => {
  // Deletes all the bookmarks for the user

  if (req.session.session_id) {
    const bookmarkObject = { email: req.session.session_id, user_id: req.session.database_id };
    const result = await dbFunctions.deleteAllBookmarksForUser(bookmarkObject);
    cache.put(req.session.session_id, result.result);
    res.status(200).json({ response: 'ok'});
  } else {
    res.status(404).json( {response: 'not authorized'});
  }
});

app.post("/logout", (req, res) => {
  req.session.session_id = null;
  res.render("home.ejs", { logged_in: false, uId: null });
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});

Object.defineProperty(Array.prototype, 'flat', {
  value: function(depth = 1) {
    return this.reduce(function (flat, toFlatten) {
      return flat.concat((Array.isArray(toFlatten) && (depth > 1)) ? toFlatten.flat(depth - 1) : toFlatten);
    }, []);
  }
  
});