# News Aggregator Web App

### About

- Using date and topics. The app will query a news API on the backend and then return a list of articles and links to the user.
- Currently coding to allow for logins and authentication and custom topics.

### Future Features

- Database implementation
- User log-ins
- saved topics
- cookies

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

#### .ENV file

You'll need .ENV file with these parameters


`PERSONAL_API_KEY= ` visit newsAPI.org and register for a key. Place it here

Database information
`DB_HOST=` 
`DB_USER=`
`DB_USER_PASSWORD=`
`DB_NAME=`
`DB_CONNECTIONSTRING=`

This is for cookies
`COOKIE_SESSION=`
`COOKIE_KEYS=`
`COOKIE_TIME_OUT=`


#### Database stack

- postgresql
- knex.js

#### Migrations

- coming soon

#### ERDs

- coming soon
