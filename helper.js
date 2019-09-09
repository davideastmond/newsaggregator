const bcrypt = require('bcrypt');
const axios = require('axios');
const moment = require('moment');
require('dotenv').config();

module.exports = {
  doMultipleQueries: function(queryString) {
    /* 
    If the user has provided a comma-separated query, extract it and make it into an array
    */
    throw Error("Not implemented.");
  },
	
	passwordMeetsSecurityRequirements: (rawPassword) => {
		const regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/;
  	return regEx.test(rawPassword);
	},

  hashPassword: function(rawPassword) {
    return bcrypt.hashSync(rawPassword, parseInt(process.env.SALT_ROUNDS));
	},
	
  hashPasswordAsync: function(rawPassword) {
    return bcrypt.hash(rawPassword, parseInt(process.env.SALT_ROUNDS));
	},
	
	doTopicsAxiosFetchRequest: (data)=> {
		// Interpret all of the user's topics (from topic.userTopics or something)
		// Map the requests for a Promise.all
		return new Promise((resolve, reject) => {
			const axios_queries = data.userTopics.map((el)=> {
				return axiosFetchFromApiSingleTopic(el.name);
			});

			Promise.all(axios_queries).then((resolved_data) => {
				// We have a lot of promise data from api fetch requests. We need to sort it somehow.
				//console.log("Resolved data from multi-axios request", resolved_data);
				resolve(resolved_data);
			});
		});
	},

	compileAPIFetchData: (fetchResults)=> {
		// This coallates all of the API fetch requests
		const dataArticles = fetchResults.map((el) => {
			return el.data.articles.map((arts) => {
				return arts;
			});
		});

		return dataArticles;
	}
};

function axiosFetchFromApiSingleTopic(str_topic) {
	// Returns the result from a single API request to the newsApi website
	const grabDate = moment().format("MM/DD/YYYY");

	// Here is where we can determine how many articles to fetch based on the amount of topics
	const url = `https://newsapi.org/v2/everything?q=${str_topic}&from=${grabDate}&sortBy=publishedAt&apiKey=${process.env.PERSONAL_API_KEY}&pageSize=20`;
	return axios.get(url);
}