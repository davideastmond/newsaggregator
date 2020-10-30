const { getFilteredSourcesList } = require("./get-filtered-sources-list-for-user");
const mockUserData = require('./mock-user-news-source-data');
const mockMasterSources = require('./mock-master-sources.json');

test('filtered sources list check flag is set to true', () => {
  const allUserSources = getFilteredSourcesList(false, mockMasterSources.sources,
    mockUserData.whiteList).mappedSources;
  const filtered = allUserSources.filter((element) => {
    return element.id === "politico"
      || element.id === "abc-news"
      || element === "the-times-of-india"
      || element.id === "vice-news"
  })

  expect(filtered.every(item => item.checked === true)).toBe(true);
  const anotherFilter = allUserSources.filter(element => element.id === "abc-news-au");
  expect(anotherFilter[0].checked).toBe(false);
})
