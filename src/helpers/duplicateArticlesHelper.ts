
import { NewsArticle, FilteredTestedList } from './types/types'
  
/**
 * For each news article, keep track of how many times the headline appears.
 * That could signal there are duplicates
 * @param {object} articleArrayData;
 * @return {[]}
 */
export function getDuplicatesFromArticleArray (articleArrayData: NewsArticle[]): FilteredTestedList {
  const duplicateTracker: any = {};
  const filteredList: NewsArticle[] = [];
  articleArrayData.forEach((article) => {
    if (!duplicateTracker[article.title]) {
      duplicateTracker[article.title] = 1;
      filteredList.push(article);
    } else {
      duplicateTracker[article.title] += 1;
    }
});

  return { filteredList: filteredList,
    test: filteredList.length === articleArrayData.length };
}

