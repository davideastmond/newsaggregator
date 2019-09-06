const express = require('express');
require('dotenv').config();
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const PORT = 6565;
const axios = require('axios');
const moment = require('moment');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const helperFunctions = require('./helper');

const dbFunctions = require("./db");

const cookieKeys = [process.env.COOKIE_KEYS];
// Middle-ware
app.use(cookieParser());
app.use(cookieSession({
  name: process.env.COOKIE_SESSION,
  keys: cookieKeys,
  maxAge: 300000 // 5 minutes
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'scripts'))); 
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user/:id/topics', express.static(path.join(__dirname, 'scripts')));
app.use('/user/:id/topics', express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');


// Get Requests
app.get("/", (req, res) => {
  
  if (req.session.session_id) {
    res.render('home.ejs', { logged_in: true, uId: req.session.session_id });
  } else {
    res.render('home.ejs', { logged_in: false, uId: null});
  }
});

app.get("/news", (req, res) => {
  // Obtain the query parameters to be used for a API fetch request
  const reqDate = req.query.date;
  const reqQuery = req.query.newsQuery;
  const url = `https://newsapi.org/v2/everything?q=${reqQuery}&from=${reqDate}&sortBy=publishedAt&apiKey=${process.env.PERSONAL_API_KEY}&pageSize=20`;
    // Create an API URI based on received info, query the URI, get a response, and send that data to render in news.ejs view
  axios.get(url).then((response) => {
    res.render('news.ejs', { articles: response.data.articles, searchQuery: reqQuery,  uId: req.session.session_id, requestDate: reqDate, count: response.data.articles.length, logged_in: req.session.session_id || false });
  })
  .catch((error) => {
    res.status(400).send({ error: error });
  });
});

app.get("/headlines", (req, res)=> {
  // Grab the date
  const dateGrab = moment().format("MM/DD/YYYY");
  let url;
  if (req.query.country) {
    url = `https://newsapi.org/v2/top-headlines?country=${req.query.country}&apiKey=${process.env.PERSONAL_API_KEY}&pageSize=20`; 
  } else {
    // Default is United States news
    url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.PERSONAL_API_KEY}&pageSize=20`;
  }

  axios.get(url).then((response) => {
    res.render('headlines.ejs', { articles: response.data.articles, uId: req.session.session_id, count: response.data.articles.length, country: req.query.country || "us", logged_in: req.session.session_id || false });
  });
  
});

// Shows login form
app.get("/login", (req, res) => {
  if (!req.session.session_id) {
    res.render('login.ejs', { message: null });
  } else {
    // They should be sent to dashboard
    res.status(200).send({response: 'send to dashboard '});
  }
});

// Shows registration page
app.get("/register", (req, res) => {
  res.render('register.ejs');
});

app.get('/user/:id/feed', (req, res) => {
  if (req.session.session_id) {
    // render the page - will have to hit the database and get the user's topic feed
    console.log("redirect user and topic!", req.session.session_id);
    
    // This won't be topics.ejcs - but instead a call to the api and live result. 
    res.status(200).send({ email: req.session.session_id, data: 'send to an actual news listing feed, based on the user topics' });
  } else {
    res.redirect("/");
  }
});

app.get('/user/:id/topics', (req, res) => {
  if (req.session.session_id) {
    /* 
    This route needs to hit the database and pull all of the topics associated with the user
    We plug the results into the ejs view variable for display.
    */
    if (req.session.session_id === req.params.id) {
      dbFunctions.getUserTopics({ email: req.session.session_id }).then((result) => {
        res.render('topics.ejs', { email: req.params.id, topics: result, logged_in: true, uId: req.session.session_id });
      });
    } else {
      res.redirect('/');
    }
  } else {
    res.redirect('/');
  }
});

app.post('/user/:id/topics/update', (req, res) => {
  res.status(400).json({ response: 'not implemented' });
});
// Receiving sign-up data.
app.post("/register", (req, res) => {
  
  // console.log(req.body.emailAddr, req.body.passwordOne, req.body.passwordTwo);
  // Has the password, then create an object to insert into the db
  if (req.session.session_id) {
    res.status(400).send({ response: 'user should log out first before registering'});
    return;
  }

  helperFunctions.hashPasswordAsync(req.body.passwordOne)
  .then((hashedPassword) => {
    const user = {
      email: req.body.emailAddr,
      password: hashedPassword,
      is_registered: true,
    };

    if (!helperFunctions.passwordMeetsSecurityRequirements(req.body.passwordOne)) {
      res.status(400).send({ error: 'password requirements are not met '});
      return;
    }
    
    // Call function to insert a new user into the user table in the DB
    dbFunctions.registerUser({ user: user }).then(() => {
      console.log("User entered into database", user);
    // Set a cookie to the user
    req.session.session_id = req.body.emailAddr; 
    
    // Re-direct to page where we can set a user's topics (GET Request))
    
    res.status(200).json({ response: `/user/${req.session.session_id}/topics` });
    })
    .catch((pError) => {
      console.log(pError.code);
      res.status(400).send({ responseJSON: pError.error || "Generic error message register user" });
    });
  });
});

app.post("/login", (req, res) => {
  // Login the user
  const timeStamp = new Date();
  const verificationObject = { email: req.body.email, password: req.body.password, last_login: timeStamp};
  dbFunctions.verifyLogin(verificationObject).then((result)=> {
    if (result.success) {
      // Set a cookie
      req.session.session_id = req.body.email;
      // They should be forwarded to their landing page - which user users/:id/feed
      res.redirect(`/user/${req.session.session_id}/feed`);
    } else {
      //res.status(401).send({ error: 'unable to authenticate login' });
      
      res.render('login.ejs', { message: "Invalid username / password" });
    }
  }).catch((err) => {
    
    res.render('login.ejs', { message: "Invalid username / password" });
  });
});


// TODO: this should be a post request
app.post("/logout", (req, res) => {
  req.session.session_id = null;
  res.render("home.ejs", { logged_in: false, uId: null });
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
