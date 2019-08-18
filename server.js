const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const PORT = 6565;

// Middle-ware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'scripts')));
app.set('view engine', 'ejs');


// Get Requests
app.get("/", (req, res) => {
	res.render('home.ejs');
});

app.get("/news", (req, res) => {
	console.log(req.query.date, " ", req.query.newsQuery);
	res.render('news.ejs');
});

app.listen(PORT, () => {
	console.log("Listening on port", PORT);
});
