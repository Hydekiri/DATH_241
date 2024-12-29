function LogOutSPSO() {
    const avatar = document.querySelector('.admin-navbar-avatar .avatar');

    if (avatar) {
        avatar.addEventListener("click", () => {
            alert("Logging out...");

            document.cookie = "token=";
            document.cookie = "id=";

            window.location.href = "./welcome.html";
        });
    } else {
        console.error("Avatar element not found. Check your HTML structure.");
    }
}

document.addEventListener("DOMContentLoaded", function() {
  fetch('http://127.0.0.1:5500/fe/scripts/general/admin-navbar.html')
      .then(response => response.text())
      .then(data => {
          document.querySelector('.admin-navbar').innerHTML = data;
      })
      .catch(error => console.error('Error loading navbar:', error));
});