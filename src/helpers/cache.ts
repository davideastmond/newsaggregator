import { NewsArticle } from './types/types';

  /** This function maps articles to an array of article urls.
  * Normally, you supply the results from the memory cache into this parameter.
  */

export function strip(cacheData: NewsArticle[]) {
  if (cacheData) {
    return cacheData.map(function(obj) {
      return obj.url;
    });
  }
}
