const { reduceAllSources } = require('./reduce-all-sources');

test("reduce all sources returns no duplicate sourceIds", () => {
  const rawSources = require('./mock-user-news-source-data').MOCK_USER_SOURCES;
  const result = reduceAllSources(rawSources.whiteList);
  const dict = [];
  result.forEach((item) => {
    expect(dict.includes(item)).toBe(false);
    dict.push(item);
  })
})

test('reducer returns correct count of sourceIds', () => {
  const rawSources = require('./mock-user-news-source-data').MOCK_CLEAN_DATA;
  const result = reduceAllSources(rawSources.whiteList);
  expect(result.length).toBe(8);
})
