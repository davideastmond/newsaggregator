"use strict";
var express = require('express');
require('dotenv').config();
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var PORT = 6565;
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var cookieKeys = [process.env.COOKIE_KEYS];
// Middle-ware
app.use(cookieParser());
app.use(cookieSession({
    name: process.env.COOKIE_SESSION,
    keys: cookieKeys,
    maxAge: parseInt(process.env.COOKIE_TIME_OUT),
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));
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
app.use(require('./routes/routes.ts'));
app.listen(PORT, function () {
    console.log('Listening on port', PORT);
});
