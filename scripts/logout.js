
document.getElementById("header-top-nav-logout-link").onclick = (e) => {
  // Send an ajax POST request to /logout to log the user out

  $.ajax({
    type: "POST",
    url: "/logout",
    data: { message: 'log out'},
    success: (res) => {
      window.location = "/";
    },
    error: (err) => {
      alert('There was an error sending the request');
    }
  });
};

document.getElementById("header-top-nav-logout-link-menu-click").onclick = (e) => {

  $.ajax({
    type: "POST",
    url: "/logout",
    data: { message: 'log out'},
    success: (res) => {
      window.location = "/";
    },
    error: (err) => {
      alert('There was an error sending the request');
    }
  });
};