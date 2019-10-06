# News Aggregator Web App

### About

- This is a full-stack news aggregator web app using JavaScript, HTML, CSS, jQuery, Node, Express and PostgreSQL.

### Features

- #### User accounts and log-ins: 
  - users can create accounts.
  - users can log in and out of the system. 
  - cookies are used to keep track of a user's log-in state.
  - relational database used to keep track of user accounts.
  - password hashing and validation has been implemented.
    #### User Profile
    - Users can change their password
- #### User custom news feed:
  - logged-in users can add/remove news topic subscriptions.
  - logged-in users can view their custom news feed based on their chosen topics.
  - relational database used to keep track of topics and topics associated with a user's subscription.
- #### Headlines
  - Any user (regardless if signed in) can view the latest headlines.
- #### Custom ad hoc topic searches
  - Any user (regardless if signed in) can search ad hoc for news articles by date and by topic.
- #### UI Responsive

- #### Saved Articles
	- Feature in progress.

### Future Feature ideas

- Saving articles to *favorites* (feature in progress)
- ad hoc custom searches with multiple search topics
- "read later" list
- testing of routes
- multiple language options

### What it looks like

![Log in screen](https://github.com/davideastmond/newsaggregator/blob/master/docs/news_agg_login_01.png)
![Main screen](https://github.com/davideastmond/newsaggregator/blob/master/docs/news_agg_main_screen_00.png)
![Your feed](https://github.com/davideastmond/newsaggregator/blob/master/docs/news_agg_your_feed_02.png)
![Update Profile](https://github.com/davideastmond/newsaggregator/blob/master/docs/news_profile_settings_03.png)
![Update topics](https://github.com/davideastmond/newsaggregator/blob/master/docs/pick_topics_04.png)
### Requirements

- This app uses [!NewsAPI](https://newsapi.org/) to grab news articles. You'll need to obtain your own API key for their service. Once obtained, include the key in your `.env` file

### How to Use

- Clone or fork the project.
- Run `npm i` to install all required packages
- Obtain your own api key from [!NewsAPI](https://newsapi.org/)
- Download or use moment.js CDN for client side
- Create a .ENV file in the app folder (more below)

- Download and install the latest version of PostgreSQL
- Initialize a knex file using `[coming soon]`
- Run the latest migration using `knex migrate:latest`
- Optional: seed the db using `knex seed:run`
- Run the server using `npm start`

- Navigate to the server home (typically `localhost:PORT`)

### Dependencies

- axios
- bcrypt
- body-parser
- bootstrap
- cookie-parser
- cookie-session
- dotenv
- express.js
- express-validator
- knex.js
- moment.js
- node.js

### .ENV file

- Rename the sample_env file to a .env, and fill out the parameters
- `PERSONAL_API_KEY=` visit newsAPI.org and register for a key. Place it here

#### Database information
- `DB_HOST=` 
- `DB_USER=`
- `DB_USER_PASSWORD=`
- `DB_NAME=`
- `DB_CONNECTIONSTRING=`

#### Cookie Info
- `COOKIE_SESSION=`
- `COOKIE_KEYS=`
- `COOKIE_TIME_OUT=`

### Database stack

- postgresql
- knex.js

### Migrations / Seeds

- coming soon

### Entity Relationship Diagrams

- coming soon
