const express = require('express');
require('dotenv').config();
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const PORT = 6565;
const axios = require('axios');

// Middle-ware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'scripts')));
app.set('view engine', 'ejs');

app.use(express.static('public'));

// Get Requests
app.get("/", (req, res) => {
	res.render('home.ejs');
	
});

app.get("/news", (req, res) => {
  // Obtain the query parameters to be used for a API fetch request
  const reqDate = req.query.date;
  const reqQuery = req.query.newsQuery;
  const url = `https://newsapi.org/v2/everything?q=${reqQuery}&from=${reqDate}&sortBy=publishedAt&apiKey=${process.env.PERSONAL_API_KEY}`;
    // Create an API URI based on received info, query the URI, get a response, and send that data to render in news.ejs view
  axios.get(url).then((response) => {
    res.render('news.ejs', { articles: response.data.articles, searchQuery: reqQuery, requestDate: reqDate, count: response.data.articles.length });
	})
	.catch((error) => {
		res.status(400).send({ error: error });
	});
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
