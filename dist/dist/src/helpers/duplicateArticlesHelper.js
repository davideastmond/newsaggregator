"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * For each news article, keep track of how many times the headline appears.
 * That could signal there are duplicates
 * @param {object} articleArrayData;
 * @return {[]}
 */
function getDuplicatesFromArticleArray(articleArrayData) {
    var duplicateTracker = {};
    var filteredList = [];
    articleArrayData.forEach(function (article) {
        if (!duplicateTracker[article.title]) {
            duplicateTracker[article.title] = 1;
            filteredList.push(article);
        }
        else {
            duplicateTracker[article.title] += 1;
        }
    });
    return { filteredList: filteredList,
        test: filteredList.length === articleArrayData.length };
}
exports.getDuplicatesFromArticleArray = getDuplicatesFromArticleArray;
