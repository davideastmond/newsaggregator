
$(() => {
  $('#header-top-nav-logout-link').click((e) => {
    // Send an ajax POST request to /logout to log the user out
    doLogout();
  });

  $('#header-top-nav-logout-link-menu-click').click((e) => {
    doLogout();
  });
});

const doLogout = ()=> {
  $.ajax({
    type: 'POST',
    url: '/logout',
    data: { message: 'log out' },
    success: () => {
      window.location = '/';
    },
    error: () => {
      alert('There was an error sending the request');
    },
  });
};
