document.addEventListener("DOMContentLoaded", () => {
    // Ensure Cookies library is available
    if (typeof Cookies === 'undefined') {
        console.error('Cookies library is not defined. Ensure js-cookie is loaded.');
        return;
    }

    // Fetch Navbar
    const navbarElement = document.querySelector('.admin-navbar');
    if (navbarElement) {
        fetch('/fe/scripts/general/student-navbar.html')
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load navbar: ${response.status}`);
                return response.text();
            })
            .then(data => {
                navbarElement.innerHTML = data;
            })
            .catch(error => console.error('Error loading navbar:', error));
    } else {
        console.error('Navbar container not found!');
    }

    // Fetch and display print history
    const fetchPrintHistory = async () => {
        const userID = Cookies.get('id');
        if (!userID) {
            console.error('User ID not found in cookies. Ensure the user is logged in.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/printconfigs/user/${userID}/history`);
            if (!response.ok) throw new Error(`Failed to fetch history: ${response.status}`);

            const history = await response.json();
            const tbody = document.querySelector('.printer-history tbody');
            if (!tbody) {
                console.error('Printer history table body not found!');
                return;
            }

            tbody.innerHTML = '';
            history.forEach(config => {
                const printTime = new Date(config.printTime);
                const statusClass = config.status === 'success' ? 'success' : 'failed';
                const statusText = config.status === 'success' ? 'In thành công' : 'Thất bại';

                const row = `
                    <tr class="${statusClass}">
                        <td>${config.printer_ID}<br>${config.location || 'N/A'}</td>
                        <td>${printTime.toLocaleDateString('vi-VN')}<br>${printTime.toLocaleTimeString('vi-VN')}</td>
                        <td>${config.numPages}<br>${config.paperSize}</td>
                        <td>${config.documents.map(doc => doc.name).join(', ')}<br>${config.documentsApproved ? 'Đã kiểm duyệt' : 'Chưa kiểm duyệt'}</td>
                        <td>${statusText}</td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        } catch (error) {
            console.error('Error fetching print history:', error);
        }
    };

    // Delete print history
    const deleteHistoryButton = document.querySelector('.delete-history-btn');
    if (deleteHistoryButton) {
        deleteHistoryButton.addEventListener('click', () => {
            if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử in?')) {
                const userID = Cookies.get('id');
                if (!userID) {
                    console.error('User ID not found in cookies. Ensure the user is logged in.');
                    return;
                }

                fetch(`http://localhost:3000/api/printconfigs/user/${userID}/history`, {
                    method: 'DELETE',
                })
                    .then(response => {
                        if (!response.ok) throw new Error(`Failed to delete history: ${response.status}`);
                        alert('Lịch sử in đã được xóa thành công!');
                        location.reload();
                    })
                    .catch(error => {
                        console.error('Error deleting history:', error);
                        alert('Đã xảy ra lỗi khi xóa lịch sử in. Vui lòng thử lại!');
                    });
            }
        });
    } else {
        console.error('Delete history button not found!');
    }

    // Back button functionality
    const backButton = document.querySelector('.return button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.history.back();
        });
    } else {
        console.error('Back button not found!');
    }

    // Fetch and display print history on page load
    fetchPrintHistory();
});
