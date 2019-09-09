# News Aggregator Web App

### About

- This is a full-stack news aggregator web app.

### Features

- #### User accounts and log ins: 
	- users can create accounts
	- users can log in and out of the system. 
	- cookies are used to keep track of login state
	- relational data base used to keep track of user accounts
	- password hashing
- #### User custom news feed:
	- users can add/remove news topic subscriptions.
	- users can view their custom feed which is populated by news articles *(in progress)*
- #### Headlines
	- Any user (regardless if they have an account) can view top headlines
- #### Custom ad hoc topic searches
	- User can search for news articles by date and by a topic

### Future Feature ideas

- Saving news articles
- Saving articles to *favourites*
- ad hoc custom searches with multiple search topics
- "read later" list

### Requirements

- This app uses [!NewsAPI](https://newsapi.org/) to grab news articles. You'll need to obtain your own API key for their service. Once obtained, include the key in your `.env` file

### How to Use

- Clone or fork the project.
- Run `npm i` to install all required packages
- Obtain your own api key from [!NewsAPI](https://newsapi.org/)
- Download or use moment.js CDN for client side
- Create a .ENV file in the app folder (more below)

- Download the latest version of PostgreSQL
- Run the latest migration using `knex migrate:latest`
- Optional: seed the db using `knex seed:run`
- Run the server using `npm start`

### Dependencies

- node.js
- express.js
- body-parser
- bootstrap
- bcrypt
- dotenv
- axios
- moment.js
- cookie-session
- cookie-parser

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
