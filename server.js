const express = require('express');
require('dotenv').config();
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const PORT = 6565;
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const cookieKeys = [process.env.COOKIE_KEYS];
// Middle-ware
app.use(cookieParser());
app.use(cookieSession({
  name: process.env.COOKIE_SESSION,
  keys: cookieKeys,
  maxAge: parseInt(process.env.COOKIE_TIME_OUT),
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
app.use(require('./routes/routes'));

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
