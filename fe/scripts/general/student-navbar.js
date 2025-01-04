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

async function setupNotificationPopup() {
    const notificationIcon = document.querySelector('.student-navbar-notification a');
    if (!notificationIcon) {
        console.error("Notification icon not found. Check your HTML structure.");
        return;
    }

    notificationIcon.addEventListener('click', async (event) => {
        event.preventDefault();
        notificationPopup.innerHTML = ''; 
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
                await fetch(`http://localhost:3000/api/d1/notifications/user/${userID}/read`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "token": `Bearer ${token}`
                    }
                });
                document.querySelector('.notification-dot').style.display = 'none';

                result.data.sort((a, b) => b.notification_ID - a.notification_ID);
                result.data.forEach(notification => {
                    const notificationElement = document.createElement('div');
                    notificationElement.classList.add('notification-item');
                    
                    const notiDate = new Date(notification.detail.createDate);
                    const date = notiDate.toLocaleDateString('vi-VN');
                    const time = notiDate.toLocaleTimeString('vi-VN');

                    notificationElement.innerHTML = `
                        <h4>${notification.detail.title}</h4>
                        <p>${notification.detail.content}</p>
                        <p class="notification-date">${date} ${time}</p>
                    `;

                    if (notification.status === 'unread') {
                        notificationElement.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
                    }

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
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
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

const notificationPopup = document.createElement('div');
    notificationPopup.classList.add('notification-popup');
    document.body.appendChild(notificationPopup);

document.addEventListener("DOMContentLoaded", async () => {
    const userID1 = parseInt(getCookie('id'));
    const token1 = getCookie('token');
    const response1 = await fetch(`http://localhost:3000/api/d1/users/${userID1}/notifications`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": `Bearer ${token1}`
        }
    });
    if (!response1.ok) console.log("Failing Getting User by ID for create config!");
    const result1 = await response1.json();

    if (result1.status === 200) {
        const hasUnread1 = result1.data.some(n => n.status === 'unread');
        if (hasUnread1) document.querySelector('.notification-dot').style.display = 'block';
        else document.querySelector('.notification-dot').style.display = 'none';
    }
})


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
    messagePopup.style.display = 'none';
    document.body.appendChild(messagePopup);

    messageIcon.addEventListener('click', (event) => {
        event.preventDefault();
        const iconRect = messageIcon.getBoundingClientRect();
        const scrollTop = window.scrollY;
        const scrollLeft = window.scrollX;

        messagePopup.style.top = `${iconRect.bottom + scrollTop + 5}px`;
        messagePopup.style.left = `${iconRect.right - 300 + scrollLeft}px`;
        messagePopup.style.display = 'block';

        messagePopup.innerHTML = `
            <input type="text" class="search-input" placeholder="Search admin..." />
            <button class="search-button">Search</button>
            <div class="recent-list"></div>
        `;

        const searchInput = messagePopup.querySelector('.search-input');
        const searchButton = messagePopup.querySelector('.search-button');
        const recentListContainer = messagePopup.querySelector('.recent-list');

        fetchRecentChats();

        searchButton.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                searchAdmins(query);
            } else {
                fetchRecentChats(); // Tải lại danh sách gần nhất nếu không có từ khóa
            }
        });

        function fetchRecentChats() {
            const userID = parseInt(getCookie('id'));
            fetch(`http://localhost:3000/api/d1/messages/names/${userID}`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 200 && data.data.length) {
                        updateRecentList(data.data);
                    } else {
                        recentListContainer.innerHTML = '<p>No Recent Chats Found</p>';
                    }
                })
                .catch(error => {
                    console.error("Error fetching recent chats:", error);
                    recentListContainer.innerHTML = '<p>Error loading recent chats</p>';
                });
        }

        function searchAdmins(query) {
            fetch(`http://localhost:3000/api/d1/messages/search?key=${encodeURIComponent(query)}&role=spso`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 200 && data.data.length) {
                        updateRecentList(data.data);
                    } else {
                        recentListContainer.innerHTML = '<p>No Results Found</p>';
                    }
                })
                .catch(error => {
                    console.error("Error searching admins:", error);
                    recentListContainer.innerHTML = '<p>Error searching admins</p>';
                });
        }

        function updateRecentList(users) {
            recentListContainer.innerHTML = '';
            users.forEach(user => {
                const userElement = document.createElement('div');
                userElement.classList.add('user-item');
                userElement.textContent = user.name;

                if (user.status === "sent" && user.user_ID === user.sender_id) {
                    userElement.style.fontWeight = 'bold';
                }

                userElement.addEventListener('click', () => {
                    showChatInterface(user);
                    messagePopup.style.display = 'none';
                });

                recentListContainer.appendChild(userElement);
            });
        }
    });

    document.addEventListener('click', (event) => {
        if (!messagePopup.contains(event.target) && !messageIcon.contains(event.target)) {
            messagePopup.style.display = 'none';
        }
    });

    function showChatInterface(admin) {

        const chatPopup = document.createElement('div');
        chatPopup.classList.add('chat-popup');
        chatPopup.style.position = 'fixed';
        chatPopup.style.bottom = '0';
        chatPopup.style.right = '10px';
        document.body.appendChild(chatPopup);
        const studentID = parseInt(getCookie('id'));

        fetch(`http://localhost:3000/api/d1/messages/change?sender_id=${studentID}&receiver_id=${admin.user_ID}`, {
            method: 'PUT', // Chỉ định phương thức PUT
            headers: {
                'Content-Type': 'application/json', // Đảm bảo đúng header nếu có payload
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    console.log("Changing completed!");
                } else {
                    chatPopup.innerHTML = '<p>Error changing status</p>';
                }
            })
            .catch(error => {
                console.error("Error changing message status:", error);
                chatPopup.innerHTML = '<p>Error changing message status</p>';
            });


        fetch(`http://localhost:3000/api/d1/messages?sender_id=${studentID}&receiver_id=${admin.user_ID}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    renderChatInterface(chatPopup, studentID, admin, data.data);
                } else {
                    chatPopup.innerHTML = '<p>Error loading chat messages</p>';
                }
            })
            .catch(error => {
                console.error("Error loading chat messages:", error);
                chatPopup.innerHTML = '<p>Error loading chat messages</p>';
            });
    }

    function renderChatInterface(chatPopup, sender_id, admin, messages) {
        fetch('http://127.0.0.1:5500/fe/scripts/general/chat-widget.html')
            .then(response => response.text())
            .then(htmlContent => {
                chatPopup.innerHTML = htmlContent;

                const chatHeader = chatPopup.querySelector('.chat-header span');
                const chatMessages = chatPopup.querySelector('.chat-messages');
                const chatInput = chatPopup.querySelector('.chat-input');
                const sendButton = chatPopup.querySelector('.send-message-button');
                //const minimizeButton = chatPopup.querySelector('.minimize-chat');
                const closeButton = chatPopup.querySelector('.close-chat');
                //const chatBody = chatPopup.querySelector('.chat-body');

                chatHeader.textContent = admin.name;

                // Hiển thị các tin nhắn ban đầu
                function displayMessages(messages) {
                    chatMessages.innerHTML = ''; // Xóa nội dung cũ
                    messages.forEach(msg => {
                        const messageElement = document.createElement('div');
                        messageElement.classList.add('message', msg.sender_id === sender_id ? 'user-message' : 'admin-message');
                        messageElement.innerHTML = `<p>${msg.content}</p><small>${msg.created_at}</small>`;
                        chatMessages.appendChild(messageElement);
                    });
                    chatMessages.scrollTop = chatMessages.scrollHeight; // Cuộn xuống cuối
                }
                displayMessages(messages);

                // Cập nhật tin nhắn định kỳ
                function updateChatMessages() {
                    fetch(`http://localhost:3000/api/d1/messages?sender_id=${sender_id}&receiver_id=${admin.user_ID}`)
                        .then(response => response.json())
                        .then(data => {
                            if (data.status === 200) {
                                displayMessages(data.data);
                            }
                        })
                        .catch(error => console.error("Error updating messages:", error));
                }

                // Gửi tin nhắn
                sendButton.addEventListener('click', () => {
                    const content = chatInput.value.trim();
                    if (!content) return;

                    fetch(`http://localhost:3000/api/d1/messages/${sender_id}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ receiver_id: admin.user_ID, content })
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.status === 201) {
                                updateChatMessages();
                                chatInput.value = '';
                            } else {
                                console.error("Error sending message:", data.message);
                            }
                        })
                        .catch(error => console.error("Error sending message:", error));
                });

                // Thu nhỏ/phóng to khung chat
                // let isMinimized = false;
                // minimizeButton.addEventListener('click', () => {
                //     if (isMinimized) {
                //         chatBody.style.display = 'block';
                //         chatMessages.scrollTop = chatMessages.scrollHeight; // Cuộn xuống cuối khi mở
                //         chatInput.focus(); // Lấy lại tiêu điểm vào khung nhập
                //         isMinimized = false;
                //     } else {
                //         chatBody.style.display = 'none';
                //         isMinimized = true;
                //     }
                // });

                // Đóng khung chat
                closeButton.addEventListener('click', () => {
                    chatPopup.remove();
                });

                updateChatMessages(); // Cập nhật ngay khi mở
                setInterval(updateChatMessages, 1000);
            })
            .catch(error => {
                console.error("Error loading chat widget:", error);
                chatPopup.innerHTML = '<p>Error loading chat interface</p>';
            });
    }

}

