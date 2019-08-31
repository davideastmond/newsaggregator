const express = require('express');
require('dotenv').config();
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const PORT = 6565;
const axios = require('axios');
const moment = require('moment');

const dbFunctions = require("./db");

// Middle-ware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'scripts')));
app.use(express.static('public'));
app.set('view engine', 'ejs');


// Get Requests
app.get("/", (req, res) => {
  res.render('home.ejs');
});

app.get("/news", (req, res) => {
  // Obtain the query parameters to be used for a API fetch request
  const reqDate = req.query.date;
  const reqQuery = req.query.newsQuery;
  const url = `https://newsapi.org/v2/everything?q=${reqQuery}&from=${reqDate}&sortBy=publishedAt&apiKey=${process.env.PERSONAL_API_KEY}&pageSize=100`;
    // Create an API URI based on received info, query the URI, get a response, and send that data to render in news.ejs view
  axios.get(url).then((response) => {
    res.render('news.ejs', { articles: response.data.articles, searchQuery: reqQuery, requestDate: reqDate, count: response.data.articles.length });
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
    url = `https://newsapi.org/v2/top-headlines?country=${req.query.country}&apiKey=${process.env.PERSONAL_API_KEY}&pageSize=100`; 
  } else {
    // Default is United States news
    url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.PERSONAL_API_KEY}&pageSize=100`;
  }

  axios.get(url).then((response) => {
    res.render('headlines.ejs', { articles: response.data.articles, count: response.data.articles.length, country: req.query.country || "us" });
  });
  
});

// Shows login form
app.get("/login", (req, res) => {
  res.render('login.ejs');
});

// Shows registration page
app.get("/register", (req, res) => {
  res.render('register.ejs');
});

// Receiving sign-up data.
app.post("/register", (req, res) => {

  // console.log(req.body.emailAddr, req.body.passwordOne, req.body.passwordTwo);
  res.status(200).send({ success: 'form data rec ok' });
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
