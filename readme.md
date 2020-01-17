# News Aggregator Web App

### About

- This is a full-stack news aggregator web app using JavaScript, HTML, CSS, jQuery, Node, Express and PostgreSQL.

### Features

- #### User accounts and log-ins: 
  - users can create accounts.
  - users can log in and out of the system. 
  - cookies are used to keep track of a user's log-in state.
  - relational database used to keep track of user accounts.
  - password hashing and validation have been implemented.
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
  - App looks good in mobile and/or web format

- #### Bookmarked Articles
  - Authenticated users can save articles for reading later. 
  - Authenticated users can remove articles from their bookmark list
    #### Cache Implementation
    - Caching system introduced to keep track of saved bookmarks across feed, news and headline pages, minimizing
    use of database.

### Future Feature ideas
- ad hoc custom searches with multiple search topics
- multiple language options
- social media sharing (using some kind of API)
- UI themes (dark / light etc)

### What it looks like

![Log in screen](https://github.com/davideastmond/newsaggregator/blob/master/docs/1_login.png)
![Main screen](https://github.com/davideastmond/newsaggregator/blob/master/docs/1_mainscreen.png)
![Your feed](https://github.com/davideastmond/newsaggregator/blob/master/docs/1_yourfeed.png)
![Update Profile](https://github.com/davideastmond/newsaggregator/blob/master/docs/1_profilesettings.png)
![Update topics](https://github.com/davideastmond/newsaggregator/blob/master/docs/1_picktopics.png)
![Bookmarks Page](https://github.com/davideastmond/newsaggregator/blob/master/docs/1_bookmarks.png)
### Requirements

- This app uses [NewsAPI](https://newsapi.org/) to grab news articles. You'll need to obtain your own API key for their service. Once obtained, include the key in your `.env` file

### How to Use

- Clone or fork the project.
- Run `npm i` to install all required packages
- Obtain your own api key from [NewsAPI](https://newsapi.org/)
- Download or use moment.js CDN for client side
- Create a .ENV file in the app folder (more below)

- Download and install the latest version of PostgreSQL
- install postgress for node using `npm install pg --save`
- Initialize a knex file using `knex init`
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
