const MOCK_USER_SOURCES = {
  email: 'test@test.com',
  whiteList: [{ topic: 'science', sourceIds: ["mtv-news", "abc-news", "breitbart-news", "fortune", "independent"] },
  { topic: 'entertainment', sourceIds: ["mtv-news", "national-review", "the-hill"] },
  { topic: 'religion', sourceIds: ["politico", "polygon", "the-hill", "the-jerusalem-post", "the-times-of-india", "vice-news"] }]
}

const MOCK_CLEAN_DATA = {
  email: 'test@test.com',
  whiteList: [{
    topic: 'science', sourceIds:
      ["al-jazeera-english", "mtv-news", "abc-news", "abc-news", "breitbart-news", "fortune", "independent", "the-verge", "the-washington-post"]
  }]
}

module.exports = { MOCK_USER_SOURCES, MOCK_CLEAN_DATA };
