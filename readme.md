# NewsOne Web App

### About

- This is a full-stack news aggregator web app called NewsOne.

#### Stack
- JavaScript, HTML, CSS, jQuery
- Node, Express, MongoDB/Mongoose, PostgreSQL/knex.js.

#### 3rd party APIs
- Mailgun
- NewsAPI

### Features

- #### User accounts and log-ins: 
  - users can create accounts.
  - users can log in and out of the system. 
  - cookies are used to keep track of a user's log-in state.
  - relational database used to keep track of user accounts.
  - password hashing and validation have been implemented.
    #### User Profile
    - Users can change their password
    - Users can recover a lost password using a security code delivered to their e-mail (using Mailgun)
- #### User custom news feed:
  - logged-in users can add/remove news topic subscriptions.
  - logged-in users can view their custom news feed based on their chosen topics.
  - relational database used to keep track of topics and topics associated with a user's subscription.
- #### Headlines
  - Any user (regardless if signed in) can view the latest headlines.
- #### Custom ad hoc topic searches
  - Any user (regardless if signed in) can search ad hoc for news articles by date and by topic.
- #### UI Responsive
  - App is responsive to a variety of screen sizes

- #### Bookmarked Articles
  - Authenticated users can save articles for reading later. 
  - Authenticated users can remove articles from their bookmark list
    #### Cache Implementation
    - Caching implemented to keep track of saved bookmarks across feed, news and headline pages, minimizing
    use of database.

### Future Feature ideas
- ad hoc custom searches with multiple search topics
- option to customize the amount of articles that are retrieved.
- social media sharing (using some kind of API)
- UI themes (dark / light etc)
- Two factor authentication implementation

### What it looks like

![Log in screen](https://github.com/davideastmond/newsaggregator/blob/master/docs/1_login.png)
![Main screen](https://github.com/davideastmond/newsaggregator/blob/master/docs/1_mainscreen.png)
![Your feed](https://github.com/davideastmond/newsaggregator/blob/master/docs/1_yourfeed.png)
![Update Profile](https://github.com/davideastmond/newsaggregator/blob/master/docs/1_profilesettings.png)
![Update topics](https://github.com/davideastmond/newsaggregator/blob/master/docs/1_picktopics.png)
![Bookmarks Page](https://github.com/davideastmond/newsaggregator/blob/master/docs/1_bookmarks.png)

### Using the app

#### Home Page

1. Select a date from the calendar and type in a topic and click `Get News`.
2. You can also checkout the latest headlines by clicking the `top headlines` link. 
3. Or you can go to your personalized feed (log-in required)

#### Login
- Enter the e-mail and password combination you used to registered with the service.
- Lost password feature coming soon!

### Reset password
- User can reset their password by having a unique code sent to their registered e-mail address.

#### Sign up

1. If you don't have an account, use the sign up feature to register for the service.
2. Enter an e-mail and a secure password then click submit. You'll be taken to a screen where you can enter topics for which you would like news articles.
3. Type a topic keyword and click add. When done adding topics, be sure to click save.

#### Settings
- Here you can change your password.
- You can also change your topics by clicking the link.

#### My Feed

- Articles that are linked to your feed topic keyword(s) appear here.
- Change your topics by hovering over your username to show the drop-down menu (or on mobile, tap the `Settings` link), clicking `Settings` > `Topics` > `Change your topics`.
- You can save (bookmark) articles for future reading by clicking the bookmark icon underneath an article element.
- The bookmark icon will turn red, indicating it has been saved.

#### Bookmarks

- On mobile click the `Bookmarks` link. On desktop hover over your username to display the menu. Click bookmarks.
- All articles you bookmarked are displayed here. 
- Delete a bookmark by clicking / tapping the trash can icon. To delete all bookmarks, tap the `Clear All` button.


#### Log out
- Click or tap to log out of the service.

### How to Install (Dev)

- Clone or fork the project.
- Run `npm i` to install all required packages
- Obtain your own api key from [NewsAPI](https://newsapi.org/)
- Create a .ENV file in the app folder (more below)

- Download and install the latest version of PostgreSQL
- install postgress for node using `npm install pg --save`
- Initialize a knex file using `knex init`
- Run the latest migration using `knex migrate:latest`
- Optional: seed the db using `knex seed:run`
- Run the server using `npm start`

- Navigate to the server home (typically `localhost:PORT`)

### .ENV file

- Rename the sample_env file to a .env, and fill out the parameters
- `PERSONAL_API_KEY=` visit newsAPI.org and register for a key. Place it here
