document.addEventListener("DOMContentLoaded", function() {
  fetch('http://127.0.0.1:5500/fe/scripts/general/login-navbar.html')
      .then(response => response.text())
      .then(data => {
          document.querySelector('.login-navbar').innerHTML = data;
      })
      .catch(error => console.error('Error loading navbar:', error));
});