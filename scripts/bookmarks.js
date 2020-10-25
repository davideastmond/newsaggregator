
/* This handles deleting the links.
User has clicked the little trash icon for a bookmarked article */
$(() => {
  $('.fa-trash-alt').on('click', (e) => {
    const delUrl = e.target.parentNode
      .parentNode
      .children[0].children[0].children[0].href;
    // Complete an AJAX post request, then refresh the page
    doAjaxRequestDeleteBookmark(delUrl).then(() => {
      window.location = '/user/user/bookmarks';
    })
      .catch(() => {
        window.location = '/';
      });
  });

  $('.btn-clear-all-bookmarks').on('click', (e) => {
    // Sends the ajax command to delete all the bookmarks for this user
    e.target.disabled = true;
    doAjaxRequestDeleteAllBookmarks().then((res) => {
      window.location = '/user/user/bookmarks';
    })
      .catch((err) => {
        console.log(err);
      });
  });

  convertDatesToDateString();
});

/**
 *
 * @param {string} urlToDelete The URL to remove from the bookmark
 * @return {Promise} Ajax request to delete a bookmark
 */
function doAjaxRequestDeleteBookmark(urlToDelete) {
  return $.ajax({
    type: 'DELETE',
    url: '/user/:id/bookmarks/:id',
    data: { url: urlToDelete },
  });
}

/**
 * @return {Promise} A promise indicating that the deletion of
 * all a user's bookmarks will be completed
 */
function doAjaxRequestDeleteAllBookmarks() {
  return $.ajax({
    type: 'DELETE',
    url: '/user/:id/bookmarks',
    data: { command: 'delete all' },
  });
}

/**
 * A DOM helper function that converts date elements
 * in the bookmark-date class into friendly readable date formats
 *
 */
function convertDatesToDateString() {
  const domObjectArray = document.getElementsByClassName('bookmark-date');

  for (let i = 0; i < domObjectArray.length; i++) {
    const bookmarkDate = new Date(domObjectArray[i].innerHTML);
    domObjectArray[i].innerHTML = bookmarkDate.toDateString('YYYY/MM/DD hh:mm');
  }
}
