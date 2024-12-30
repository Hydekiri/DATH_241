const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

// Ensure user_ID is available
const user_ID = parseInt(getCookie('id'));
if (!user_ID) {
    console.error('User ID not found in cookies');
    alert('User not authenticated');
}

const urlParams = new URLSearchParams(window.location.search);
const printer_ID = urlParams.get('printer_ID');
console.log('Printer ID:', printer_ID);  // Debug log for printer_ID
console.log('user_ID ID:', user_ID);  
const fetchPrinterHistory = async () => {
    try {
        await fetchPrinterHistoryInfo();
        await fetchPrinterHistoryInfo2();
    } catch (error) {
        console.error("Error fetching printer history:", error);
    }
};

const fetchPrinterHistoryInfo = async () => {
    const token = getCookie('token');
    try {
        const response = await fetch(`http://localhost:3000/api/d1/users/${user_ID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token": `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error("Không thể lấy thông tin user");
        const data = await response.json();
        renderPrinterInfo(data.data);
    } catch (error) {
        console.error(error);
        alert("Không thể tải thông tin máy in!");
    }
};

const fetchPrinterHistoryInfo2 = async () => {
    const token = getCookie('token');
    try {
        const response = await fetch(`http://localhost:3000/api/d1/printconfigs/user/${user_ID}/history`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token": `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error("Không thể lấy lịch sử máy in");
        const data = await response.json();
        renderPrintHistory(data.data || []);

        // Lọc chỉ các mục có status là "Completed"
        // const completedHistory = data.data.filter(record => record.status === "Completed");

        // renderPrintHistory(completedHistory);
    } catch (error) {
        console.error(error);
        alert("Không thể tải lịch sử máy in!");
    }
};

const renderPrinterInfo = (user) => {
    if (!user) {
        console.error("User data is not available");
        alert("Không thể hiển thị thông tin người dùng!");
        return;
    }

    document.querySelector(".uName").innerHTML = `<span>Tên:</span> ${user.name || 'N/A'}`;
    document.querySelector(".uID").innerHTML = `<span>ID:</span> ${user.user_ID || 'N/A'}`;
    document.querySelector(".pageBalance").innerHTML = `<span>Số trang in:</span> ${user.pageBalance || 0}`;
    document.querySelector(".eMail").innerHTML = `<span>Email: </span> ${user.email || 'N/A'}`;
    
    const statusText = user.role === 'student' ? 'Hoạt động' : 'Vô hiệu hóa';
    const statusColor = user.role === 'student' 
        ? 'rgb(0, 202, 0)' 
        : 'red';
    document.querySelector(".status").innerHTML = `<span>Trạng thái:</span> <span style="color: ${statusColor};">${statusText}</span>`;
};


const renderPrintHistory = (history) => {
    const tbody = document.querySelector(".printer-history tbody");
    tbody.innerHTML = ''; // Clear existing rows

    if (!history.length) {
        tbody.innerHTML = '<tr><td colspan="5">Không có dữ liệu</td></tr>';
        return;
    }

    history.forEach((record) => {
        const formattedDate = new Date(record.printStart).toLocaleDateString('vi-VN');
        const formattedTime = new Date(record.printStart).toLocaleTimeString('vi-VN');
        const statusClass = record.status.toLowerCase() === 'completed' ? 'success' : 'error';
        const documents = record.documents?.map(doc => doc.name).join('<br>') || 'N/A';

        const row = `
            <tr class="${statusClass}">
                <td>${record.printer?.branchName || 'N/A'}<br>${record.printer?.location?.building || ''}</td>
                <td>${formattedDate}<br>${formattedTime}</td>
                <td>${record.numPages} (x${record.numCopies})<br>${record.paperSize}</td>
                <td>${documents}</td>
                <td>${record.status === 'Completed' ? 'In thành công' : 'Thất bại'}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
};

const handleDeletePrintHistory = async () => {
    const confirmation = window.confirm("Bạn có chắc muốn xóa toàn bộ lịch sử in của người dùng này không?");
    if (!confirmation) return;

    const token = getCookie('token');
    if (!user_ID) {
        alert('Không thể xác định người dùng!');
        return;
    }

    try {
        // Send DELETE request to remove all print history for the user
        const response = await fetch(`http://localhost:3000/api/d1/printconfigs/user/${user_ID}/history`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'token': `Bearer ${token}`,
            }
        });

        if (!response.ok) {
            throw new Error("Không thể xóa lịch sử in của người dùng");
        }

        // Refresh the page or update the UI to reflect the changes
        alert("Đã xóa lịch sử in của người dùng thành công!");
        window.location.reload();  // Reload the page to refresh the data

    } catch (error) {
        console.error(error);
        alert("Không thể xóa lịch sử in lúc này!");
    }
};

// Add event listener for the delete button
document.querySelector('.delete-history-btn').addEventListener('click', handleDeletePrintHistory);

window.onload = fetchPrinterHistory;

document.querySelector(".return button").addEventListener("click", () => {
    window.history.back(); // Quay lại trang trước đó
});
