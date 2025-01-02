function LogOutSPSO() {

    const logoutTab = document.querySelector('.admin-navbar-avatar .logout-tab');

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
    const res = await fetch('http://127.0.0.1:5500/fe/scripts/general/admin-navbar.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('.admin-navbar').innerHTML = data;
        })
        .catch(error => console.error('Error loading navbar:', error));

    const avatar = document.querySelector('.admin-navbar-avatar .avatar');

    if (avatar) avatar.addEventListener("click", () => {
        avatar.parentElement.classList.toggle("active");
    });
    setupMessagePopup();
});


function setupMessagePopup() {
    const messageIcon = document.querySelector('.admin-header-chat a');
    if (!messageIcon) {
        console.error("Message icon not found. Check your HTML structure.");
        return;
    }

    const messagePopup = document.createElement('div');
    messagePopup.classList.add('message-popup');
    messagePopup.style.display = 'none'; // Ban đầu ẩn popup
    document.body.appendChild(messagePopup);

    messageIcon.addEventListener('click', (event) => {
        event.preventDefault();
        const iconRect = messageIcon.getBoundingClientRect();
        const scrollTop = window.scrollY;
        const scrollLeft = window.scrollX;

        messagePopup.style.top = `${iconRect.bottom + scrollTop + 5}px`;
        messagePopup.style.left = `${iconRect.right - 300 + scrollLeft}px`;
        messagePopup.style.display = 'block';

        fetch('http://localhost:3000/api/d1/users?role=student')
            .then(response => response.json())
            .then(data => {
                if (data.status === 200 && data.data.length) {
                    showStudentList(data.data);
                } else {
                    messagePopup.innerHTML = '<p>No Students Found</p>';
                }
            })
            .catch(error => {
                console.error("Error fetching students:", error);
                messagePopup.innerHTML = '<p>Error loading students</p>';
            });
    });

    document.addEventListener('click', (event) => {
        if (!messagePopup.contains(event.target) && !messageIcon.contains(event.target)) {
            messagePopup.style.display = 'none';
        }
    });

    function showStudentList(students) {
        messagePopup.innerHTML = '<h4>Select an Student</h4>';
        console.log(students);
        students.forEach(student => {
            const adminElement = document.createElement('div');
            adminElement.classList.add('admin-item');
            adminElement.textContent = student.name;

            adminElement.addEventListener('click', () => {
                showChatInterface(student);
                messagePopup.style.display = 'none';
            });

            messagePopup.appendChild(adminElement);
        });
    }

    function showChatInterface(student) {
        const chatPopup = document.createElement('div');
        chatPopup.classList.add('chat-popup');
        chatPopup.style.position = 'fixed';
        chatPopup.style.bottom = '0';
        chatPopup.style.right = '10px';
        document.body.appendChild(chatPopup);
        const userID = parseInt(getCookie('id'));
        console.log(userID);

        fetch(`http://localhost:3000/api/d1/messages?sender_id=${userID}&receiver_id=${student.user_ID}`) // Giả sử sender_id=1
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    renderChatInterface(chatPopup, userID, student, data.data);
                } else {
                    chatPopup.innerHTML = '<p>Error loading chat messages</p>';
                }
            })
            .catch(error => {
                console.error("Error loading chat messages:", error);
                chatPopup.innerHTML = '<p>Error loading chat messages</p>';
            });
    }

    function renderChatInterface(chatPopup, sender_id, student, messages) {
        fetch('http://127.0.0.1:5500/fe/scripts/general/chat-widget.html') // Đường dẫn tới file chat-widget.html
            .then(response => response.text())
            .then(htmlContent => {
                chatPopup.innerHTML = htmlContent; // Thêm nội dung HTML vào chatPopup

                const chatHeader = chatPopup.querySelector('.chat-header span');
                const chatMessages = chatPopup.querySelector('.chat-messages');
                const chatInput = chatPopup.querySelector('.chat-input');
                const sendButton = chatPopup.querySelector('.send-message-button');
                const minimizeButton = chatPopup.querySelector('.minimize-chat');
                const closeButton = chatPopup.querySelector('.close-chat');
                const chatBody = chatPopup.querySelector('.chat-body');

                // Gắn tên admin vào tiêu đề
                chatHeader.textContent = student.name;

                // Hiển thị các tin nhắn
                messages.forEach(msg => {
                    const messageElement = document.createElement('div');
                    messageElement.classList.add('message', msg.sender_id === sender_id ? 'user-message' : 'admin-message'); // Giả sử sender_id=1
                    messageElement.innerHTML = `<p>${msg.content}</p><small>${msg.created_at}</small>`;
                    chatMessages.appendChild(messageElement);
                });

                // Gửi tin nhắn
                sendButton.addEventListener('click', () => {
                    const content = chatInput.value.trim();
                    if (!content) return;

                    fetch(`http://localhost:3000/api/d1/messages/${sender_id}`, { // Giả sử sender_id=1
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ receiver_id: student.user_ID, content })
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.status === 201) {
                                const messageElement = document.createElement('div');
                                messageElement.classList.add('message', 'user-message');
                                messageElement.innerHTML = `<p>${content}</p><small>${new Date().toLocaleTimeString()}</small>`;
                                chatMessages.appendChild(messageElement);
                                chatInput.value = '';
                            } else {
                                console.error("Error sending message:", data.message);
                            }
                        })
                        .catch(error => console.error("Error sending message:", error));
                });

                // Thu nhỏ/phóng to khung chat
                let isMinimized = false;
                minimizeButton.addEventListener('click', () => {
                    if (isMinimized) {
                        chatBody.style.display = 'block';
                        isMinimized = false;
                    } else {
                        chatBody.style.display = 'none';
                        isMinimized = true;
                    }
                });

                // Đóng khung chat
                closeButton.addEventListener('click', () => {
                    chatPopup.remove();
                });
            })
            .catch(error => {
                console.error("Error loading chat widget:", error);
                chatPopup.innerHTML = '<p>Error loading chat interface</p>';
            });
    }

}

function getCookie(name) {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;  // If cookie not found
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}