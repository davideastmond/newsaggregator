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

const dbFunctions = require("./db");

const saltRounds = 10;
const cookieKeys = [process.env.COOKIE_KEYS];
// Middle-ware
app.use(cookieParser());
app.use(cookieSession({
  name: process.env.COOKIE_SESSION,
  keys: cookieKeys
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'scripts'))); 
app.use(express.static('public'));
app.set('view engine', 'ejs');


// Get Requests
app.get("/", (req, res) => {
  console.log("IP", req.connection.remoteAddress, "connected @", moment().format("YYYY/MM/DD h:mm:ss a"));
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
    res.render('news.ejs', { articles: response.data.articles, searchQuery: reqQuery, requestDate: reqDate, count: response.data.articles.length, logged_in: req.session.session_id || false });
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
    res.render('headlines.ejs', { articles: response.data.articles, count: response.data.articles.length, country: req.query.country || "us", logged_in: req.session.session_id || false });
  });
  
});

// Shows login form
app.get("/login", (req, res) => {
  res.render('login.ejs', { message: null });
});

// Shows registration page
app.get("/register", (req, res) => {
  res.render('register.ejs');
});

app.get('/topics', (req, res) => {
  if (req.session.session_id) {
    // render the page
    console.log(req.session.session_id);
    res.render('topics.ejs', { email: req.session.session_id });
  } else {
    res.redirect("/");
  }
});

// Receiving sign-up data.
app.post("/register", (req, res) => {
  
  // console.log(req.body.emailAddr, req.body.passwordOne, req.body.passwordTwo);
  // Has the password, then create an object to insert into the db

  bcrypt.hash(req.body.passwordOne, saltRounds).then((hashedPassword) => {
    // Create a user object for insertion into the pg db
    const user = {
      email: req.body.emailAddr,
      password: hashedPassword,
      is_registered: true,
    };

    // Call function to insert a new user into the user table in the DB
    dbFunctions.registerUser({ user: user }).then((result) => {
      console.log("User entered into database", user);
     // Set a cookie to the user
     req.session.session_id = req.body.emailAddr; // Cookie set
     res.redirect('/topics');
    })
    .catch((err) => {
      res.status(400).send({ error: `E-mail ${user.email} already exists in the database.` });
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
      res.status(200).send({ status: 'ok'});
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
