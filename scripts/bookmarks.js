// This handles deleting the links. User has clicked the little trash icon for a bookmarked article
$(()=> {
  $('.fa-trash-alt').on('click', (e) => {
    const del_url = e.target.parentNode.parentNode.children[0].children[0].children[0].href;
		console.log(del_url);
    // Complete an AJAX post request, then refresh the page
    doAjaxRequestDeleteBookmark(del_url).then(() => {
      window.location = "/user/user/bookmarks";
    })
    .catch(() => {
      console.log("Unable to delete bookmark");
    });
  });
});

/**
 * 
 * @param {string} urlToDelete The URL to remove from the bookmark
 * @returns {Promise} Ajax request to delete a bookmark
 */
function doAjaxRequestDeleteBookmark(urlToDelete) {
  // Sends an ajax request to delete a bookmarked URL from the user's bookmark list
  return $.ajax({
    type: "POST",
    url: "/user/:id/bookmarks/delete",
    data: { url: urlToDelete }
  });
}