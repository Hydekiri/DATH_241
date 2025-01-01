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
    const res = await fetch('http://127.0.0.1:5500/fe/scripts/general/student-navbar.html')
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
    setupMessagePopup();
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

//message
// document.addEventListener('DOMContentLoaded', () => {
//     // Các chức năng khác của navbar
//     loadChatWidget(); // Tải khung chat
// });

function setupMessagePopup() {
    const messageIcon = document.querySelector('.student-header-chat a');
    if (!messageIcon) {
        console.error("Message icon not found. Check your HTML structure.");
        return;
    }

    const messagePopup = document.createElement('div');
    messagePopup.classList.add('message-popup');
    messagePopup.style.display = 'none'; // Ban đầu ẩn popup
    document.body.appendChild(messagePopup);

    // Hiển thị popup bên dưới icon message
    messageIcon.addEventListener('click', (event) => {
        event.preventDefault();

        // Lấy vị trí của message icon
        const iconRect = messageIcon.getBoundingClientRect();
        const scrollTop = window.scrollY; // Bù đắp nếu người dùng đã cuộn
        const scrollLeft = window.scrollX;

        // Đặt vị trí popup
        messagePopup.style.top = `${iconRect.bottom + scrollTop + 5}px`; // Cách icon 5px
        messagePopup.style.left = `${iconRect.right - 300 + scrollLeft}px`; // Popup rộng 300px, canh phải
        messagePopup.style.display = 'block'; // Hiển thị popup

        showAdminList(); // Hiển thị danh sách admin
    });

    // Đóng popup nếu click ra ngoài
    document.addEventListener('click', (event) => {
        if (!messagePopup.contains(event.target) && !messageIcon.contains(event.target)) {
            messagePopup.style.display = 'none'; // Ẩn popup
        }
    });

    // Hiển thị danh sách admin
    function showAdminList() {
        messagePopup.innerHTML = '<h4>Select an Admin</h4>';
        const adminList = [
            { id: 1, name: 'Admin 1' },
            { id: 2, name: 'Admin 2' },
            { id: 3, name: 'Admin 3' },
        ];
        adminList.forEach(admin => {
            const adminElement = document.createElement('div');
            adminElement.classList.add('admin-item');
            adminElement.textContent = admin.name;

            // Chuyển sang giao diện chat khi chọn admin
            adminElement.addEventListener('click', () => {
                showChatInterface(admin);
                messagePopup.style.display = 'none';
                console.log(admin);
            });

            messagePopup.appendChild(adminElement);
        });
    }

    // Hiển thị giao diện chat
    function showChatInterface(admin) {
        // Fetch nội dung từ file chat-widget.html
        fetch('http://127.0.0.1:5500/fe/scripts/general/chat-widget.html')
            .then(response => response.text())
            .then(htmlContent => {
                // Tạo một container ẩn để chứa nội dung HTML tạm thời
                const container = document.createElement('div');
                container.innerHTML = htmlContent;

                // Truy cập vào các phần tử trong HTML vừa tải về
                const messagePopup = container.querySelector('.chat-popup');
                const chatHeader = messagePopup.querySelector('.chat-header');
                const chatBody = messagePopup.querySelector('.chat-body');
                const chatMessages = chatBody.querySelector('.chat-messages');
                const chatInput = chatBody.querySelector('.chat-input');
                const sendButton = chatBody.querySelector('.send-message-button');
                const minimizeButton = messagePopup.querySelector('.minimize-chat');
                const closeButton = messagePopup.querySelector('.close-chat');

                // Cập nhật tên admin vào header
                chatHeader.querySelector('span').textContent = admin.name;

                // Dữ liệu tĩnh tin nhắn (có thể lấy từ API hoặc cơ sở dữ liệu)
                const staticMessages = [
                    { sender: 'admin', content: 'Hello! How can I assist you today?', timestamp: '10:00 AM' },
                    { sender: 'user', content: 'I need help with my account.', timestamp: '10:02 AM' },
                ];

                // Hiển thị tin nhắn mẫu
                staticMessages.forEach(message => {
                    const messageElement = document.createElement('div');
                    messageElement.classList.add('message', message.sender === 'user' ? 'user-message' : 'admin-message');
                    messageElement.innerHTML = `
                        <p>${message.content}</p>
                        <small>${message.timestamp}</small>
                    `;
                    chatMessages.appendChild(messageElement);
                });

                // Gửi tin nhắn mới
                sendButton.addEventListener('click', () => {
                    const messageContent = chatInput.value.trim();
                    if (messageContent) {
                        const messageElement = document.createElement('div');
                        messageElement.classList.add('message', 'user-message');
                        messageElement.innerHTML = `
                            <p>${messageContent}</p>
                            <small>${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                        `;
                        chatMessages.appendChild(messageElement);
                        chatInput.value = '';
                        chatMessages.scrollTop = chatMessages.scrollHeight; // Cuộn xuống cuối
                    }
                });

                // Thu nhỏ/phóng to khung chat
                let isMinimized = false; // Biến kiểm tra trạng thái thu nhỏ

                minimizeButton.addEventListener('click', () => {
                    if (isMinimized) {
                        chatBody.style.display = 'block'; // Phóng to lại
                        isMinimized = false;
                    } else {
                        chatBody.style.display = 'none'; // Thu nhỏ
                        isMinimized = true;
                    }
                });

                // Đóng khung chat
                closeButton.addEventListener('click', () => {
                    messagePopup.style.display = 'none';
                });

                // Đưa khung chat về vị trí cố định dưới cùng bên phải
                messagePopup.style.position = 'fixed';
                messagePopup.style.bottom = '0';
                messagePopup.style.right = '10px';

                // Chèn vào DOM
                document.body.appendChild(messagePopup);
                messagePopup.style.display = 'block';
            })
            .catch(error => {
                console.error("Error loading chat widget:", error);
            });
    }




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