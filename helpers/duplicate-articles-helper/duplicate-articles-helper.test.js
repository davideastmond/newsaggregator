/* eslint-disable max-len */

const duplicateHelpers = require('./duplicate-articles-helper');

describe('Duplicate articles function tester', ()=> {
  it('should there be articles with duplicate titles, the function should return false', ()=> {
    const jsonArticles = require('./duplicate_articles.json');
    const result = duplicateHelpers.getDuplicatesFromArticleArray(jsonArticles);
    expect(result.test).toBe(false);
  });

  it('should return an array length of 4 for distinct articles whose duplicates have been removed', ()=> {
    const jsonArticles = require('./duplicate_articles.json');
    const result = duplicateHelpers.getDuplicatesFromArticleArray(jsonArticles);
    expect(result.filteredList.length).toBe(4);
  });

  it('should there be articles with no titles, the function should return true', ()=> {
    const jsonArticles = require('./distinctive_articles.json');
    const result = duplicateHelpers.getDuplicatesFromArticleArray(jsonArticles);
    return expect(result.test).toBe(true);
  });
});
