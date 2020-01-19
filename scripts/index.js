$(document).ready(()=> {
  // Bind the datepicker to the text input
  $('#date').datepicker();


  $('#news-query-form').submit((e) => {
    // Submit a post request. Create a HTTP Request
    e.preventDefault();
    const xhr = new XMLHttpRequest();
    const newsQuery = document.getElementById('news-topic').value.trim();
    const queryDate = document.getElementById('date').value.trim();
    const params = `date=${queryDate}&newsQuery=${newsQuery}`;
    $('#login-submit-button').attr('disabled', true);

    xhr.open('GET', '/news' + '?' + params, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'document';

    // Gather the query and the date
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200 ) {
        // Load the page once we get a response
        window.location.href = xhr.responseURL;
      }
    };
    xhr.send();
  });
});
