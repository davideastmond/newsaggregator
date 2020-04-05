"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** This function maps articles to an array of article urls.
* Normally, you supply the results from the memory cache into this parameter.
*/
function Strip(cacheData) {
    if (cacheData) {
        return cacheData.map(function (obj) {
            return obj.url;
        });
    }
}
exports.Strip = Strip;
