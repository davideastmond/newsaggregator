const axios = require('axios');
const assert = require('assert');

module.exports = {
  /**
   * Gets the range of possible news sources from API
   */
  fetchAllSources: async () => {
    const apiKey = process.env.PERSONAL_API_KEY;
    assert(apiKey !== null || apiKey !== undefined, "API key is null or undefined");
    const uri = `https://newsapi.org/v2/sources?language=en&apiKey=${apiKey}`
    const { data } = await axios.get(uri);
    return data;
  }
}
