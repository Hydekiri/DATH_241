function LogOutSTD() {

    const logoutTab = document.querySelector('.student-navbar-avatar .logout-tab');

    if (logoutTab) {
        logoutTab.addEventListener("click", () => {

            document.cookie = "token=";
            document.cookie = "id=";

            window.location.href = "./welcome.html";
        });
    } else {
        console.error("Logout tab not found. Check your HTML structure.");
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const res = await fetch('http://127.0.0.1:5500/scripts/general/student-navbar.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('.student-navbar').innerHTML = data;
        })
        .catch(error => console.error('Error loading navbar:', error));

    const avatar = document.querySelector('.student-navbar-avatar .avatar');
    if (avatar) avatar.addEventListener("click", () => {
        avatar.parentElement.classList.toggle("active");
    });

    setupNotificationPopup(); // Ensure the function is called
});

function setupNotificationPopup() {
    const notificationIcon = document.querySelector('.student-navbar-notification a');
    if (!notificationIcon) {
        console.error("Notification icon not found. Check your HTML structure.");
        return;
    }

    const notificationPopup = document.createElement('div');
    notificationPopup.classList.add('notification-popup');
    notificationPopup.style.position = 'absolute'; // Ensure the popup is positioned correctly
    notificationPopup.style.display = 'none'; // Initially hide the popup
    document.body.appendChild(notificationPopup);

    notificationIcon.addEventListener('click', async (event) => {
        event.preventDefault();
        notificationPopup.innerHTML = ''; // Clear previous notifications
        notificationPopup.style.display = 'block';

        try {
            const userID = parseInt(getCookie('id'));
            const token = getCookie('token');
            const response = await fetch(`http://localhost:3000/api/d1/users/${userID}/notifications`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "token": `Bearer ${token}`
                }
            });
            if (!response.ok) console.log("Failing Getting User by ID for create config!");
            const result = await response.json();

            if (result.status === 200) {
                result.data.forEach(notification => {
                    const notificationElement = document.createElement('div');
                    notificationElement.classList.add('notification-item');
                    notificationElement.innerHTML = `
                        <h4>${notification.detail.title}</h4>
                        <p>${notification.detail.content}</p>
                    `;
                    notificationPopup.appendChild(notificationElement);
                });
            } else {
                notificationPopup.innerHTML = '<p>No notifications found.</p>';
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            notificationPopup.innerHTML = '<p>Error fetching notifications.</p>';
        }
    });

    document.addEventListener('click', (event) => {
        if (!notificationPopup.contains(event.target) && !notificationIcon.contains(event.target)) {
            notificationPopup.style.display = 'none';
        }
    });
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function getCookie(name) {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;  // If cookie not found
}