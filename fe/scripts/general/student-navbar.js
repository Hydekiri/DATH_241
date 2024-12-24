document.addEventListener("DOMContentLoaded", function() {
  fetch('http://127.0.0.1:5500/fe/scripts/general/student-navbar.html')
      .then(response => response.text())
      .then(data => {
          document.querySelector('.student-navbar').innerHTML = data;
      })
      .catch(error => console.error('Error loading navbar:', error));
});