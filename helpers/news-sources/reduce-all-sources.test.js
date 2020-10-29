const { TestScheduler } = require('jest');
const { reduceAllSources } = require('./reduce-all-sources');

test("reduce all sources returns no duplicate sourceIds", () => {
  const rawSources = require('./mock-user-news-source-data');
  const result = reduceAllSources(rawSources.whiteList);
  expect(result.length).toBe(14);
})
