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
    // This won't be topics.ejcs - but instead a call to the api and live result. 
    
    dbFunctions.getUserTopics({ email: req.session.session_id }).then((resultingData) => {
      //console.log("98 resulting data", resultingData);
      helperFunctions.doTopicsAxiosFetchRequest({ userTopics: resultingData, db_id: req.session.database_id }).then((fetchResults) => {
        // Once we get our results, we need to render the page for the user

        const dataArticles = helperFunctions.compileAPIFetchData(fetchResults);
        
        //console.log("FETCH RESULTS", fetchResults[0].data.articles);
        res.render('feed.ejs', { uId: req.session.session_id, data: resultingData, arrayCount: dataArticles.length, data_articles: dataArticles.flat() } );
        //res.status(200).json({ email: req.session.session_id, data: resultingData, arrayCount: dataArticles.length, data_articles: dataArticles.flat() });
      });
    });
    
  } else {
    res.redirect("/login");
  }
});

app.get('/user/:id/topics', (req, res) => {
  if (req.session.session_id) {
    /* 
    This is the topics configuration page.
    This route needs to hit the database and pull all of the topics associated with the user
    We plug the results into the ejs view variable for display.
    */
  
    dbFunctions.getUserTopics({ email: req.session.session_id }).then((result) => {
      res.render('topics.ejs', { email: req.params.id, topics: result, logged_in: true, uId: req.session.session_id });
    });
    
  } else {
    res.redirect('/login');
  }
});

app.get('/user/:id/profile', (req, res) => {
  /* 
  This route will display the user's profile page. It will allow the user to change their password
  */
  if (req.session.session_id) {
    res.render('profile.ejs', { uId: req.session.session_id });
  } else {
    res.redirect('/login');
  }
});

app.post('/user/:id/profile/update', (req, res) => {
	// This route handles password changes

  if (req.session.session_id) {
		// Database request. This essentially updates the user's password
		dbFunctions.updateUserPassword({ forUser: req.session.session_id, rawPassword: req.body.pwdone })
		.then((result) => {
			console.log("Update user password resulting data, ", result);
			// Send a good response
			res.status(200).json({ status: 'ok', newURL: "#"}); // 
		})
		.catch((error) => {
			res.status(400).json( { error: error, message: 'Unable to update the password '});
		});
  } else {
    res.redirect('/login');
  }
});

app.post('/user/:id/topics/update', (req, res) => {
  if (req.session.session_id) {
    // This route is responsible for updating the DB with the changes to a user's topics subscription.
    const updateData = { email: req.session.session_id, database_id: req.session.database_id, topicArray: JSON.parse(req.body.topics) };
  
    // We have an array of new topics for the user. We need to hit the database. Reference by email
    dbFunctions.updateTopicListForUser(updateData).then((result) => {
			console.log("164 - update topics to database");
      res.status(200).json({response: 'ok'});
    })
    .catch((error) => {
    
      res.status(500).json({status: 'unable to update the database'});
    });
    
  } else {
    res.redirect("/");
  }
  
});
// Receiving sign-up data.
app.post("/register", (req, res) => {
	
	// If there is a current session, user must log out
  if (req.session.session_id) {
    res.status(400).send({ response: 'user should log out first before registering'});
    return;
	}

	dbFunctions.registerUser({ email: req.body.emailAddr, password: req.body.passwordOne, is_registered: true})
	.then((result) => {
		
		// Assign the session_id / database_id
		
		req.session.session_id = result.response[0].email;
		req.session.database_id = result.response[0].id;
		res.status(200).json({ response: `/user/${req.session.session_id}/topics` });
		return;
	})
	.catch((error) => {
		res.status(400).send({ error: error.message, message: 'Error registering user'});
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
      req.session.database_id = result.db_id;
      // They should be forwarded to their landing page - which user users/:id/feed
      res.redirect(`/user/${req.session.session_id}/feed`);
    } else {
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

Object.defineProperty(Array.prototype, 'flat', {
  value: function(depth = 1) {
    return this.reduce(function (flat, toFlatten) {
      return flat.concat((Array.isArray(toFlatten) && (depth > 1)) ? toFlatten.flat(depth - 1) : toFlatten);
    }, []);
  }
});