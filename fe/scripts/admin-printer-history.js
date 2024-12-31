const urlParams = new URLSearchParams(window.location.search);
const printer_ID = urlParams.get('printer_ID');

console.log(printer_ID); // Hiển thị printer_ID lên console


const fetchPrinterHistory = async () => {
    fetchPrinterHistoryInfo();
    fetchPrinterHistoryInfo2();
};
// Fetch thông tin máy in và hiển thị
const fetchPrinterHistoryInfo = async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/d1/printers/${printer_ID}`);
        if (!response.ok) {
            throw new Error("Không thể lấy thông tin máy in");
        }
        const data = await response.json();
        console.log(data); // Xử lý dữ liệu máy in ở đây
        renderPrinterInfo(data.data); // Render thông tin chung
    } catch (error) {
        console.error(error);
        alert("Không thể tải thông tin máy in!");
    }
};
const fetchPrinterHistoryInfo2 = async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/d1/printconfigs/printer/${printer_ID}`);
        if (!response.ok) {
            throw new Error("Không thể lấy lịch sử máy in");
        }
        const data = await response.json();
        console.log(data); 
        renderPrintHistory(data.data); 
    } catch (error) {
        console.error(error);
        // alert("Không thể tải lịch sử máy in!");
    }
};

// Hàm render thông tin chung của máy in
const renderPrinterInfo = (printer) => {
    document.querySelector(".IDPrinter").innerHTML = `<span>ID:</span> ${printer.Printer_ID}`;
    document.querySelector(".model").innerHTML = `<span>Model:</span> ${printer.model}`;
    document.querySelector(".location").innerHTML = `<span>Vị trí:</span> ${printer.location.building}`;
    document.querySelector(".wei").innerHTML = `<span>Trọng Lượng: </span>${printer.weight || 'N/A'}`;
    
    const statusColor = printer.status === 'enable' ? ' background-color: #1edf043f; padding: 2px 2px; border-radius: 10px;color: #00C10D; ' : 'color: red; background-color: #FFCCCC;padding: 2px 2px; border-radius: 10px;';
    const statusText = printer.status === 'enable' ? 'Hoạt động' : 'Vô hiệu hóa';
    document.querySelector(".status").innerHTML = `<span>Trạng thái:</span> <span style='${statusColor}'>${statusText}</span>`;
    // Lịch sử in
    const historyContainer = document.querySelector(".history-container");
    historyContainer.innerHTML = `
        <a href="#">Chi tiết</a>
        <i class="fas fa-info-circle printer-infor" style="font-size: 24px; color: #ffffff; margin-right: 10px;" onclick="showPrinterInfo(${printer.Printer_ID})"></i>
    `;
};
const renderPrintHistory = (history) => {
    // const printconfigDisplay = document.querySelector('.printconfig-display');
    const historyContainer = document.querySelector(".printer-history tbody");
    historyContainer.innerHTML = ''; // Clear existing rows
    
    if (!history || !history.length) {
        // Thêm dòng hiển thị "Không có dữ liệu" nếu lịch sử trống
        historyContainer.innerHTML = '<tr><td colspan="5">Không có dữ liệu</td></tr>';
        return;
    }

    history.forEach(config => {
        // Ensure that we have a user and documents
        const statusClass = config.status === 'completed' ? 'success' : 'error'; 
        const formattedDateEnd = config.printEnd 
            ? new Date(config.printEnd).toLocaleDateString('vi-VN') 
            : 'N/A';
        const formattedTimeEnd = config.printEnd 
            ? new Date(config.printEnd).toLocaleTimeString('vi-VN') 
            : ' ';
        const historyRow = `
            <tr class="${statusClass}">
                <td>${config.user ? `${config.user.name}<br> ID: ${config.user.user_ID}` : 'N/A'}</td>
                <td>${formattedDateEnd}<br>${formattedTimeEnd}</td>
                <td>${config.paperSize}<br>${config.numPages}</td>
                <td>${config.documents.map(doc => doc.name).join('<br>')}</td>
                <td>${config.status === 'completed' ? 'Successful' : 'Waited'}</td>
            </tr>
        `;
        historyContainer.innerHTML += historyRow; // Append the new row
    });
    if (!historyContainer.innerHTML.trim()) {
        historyContainer.innerHTML = '<tr><td colspan="5">Không có dữ liệu</td></tr>';
    }
};
const handleDeletePrintHistory = async () => {
    const confirmation = window.confirm("Bạn có chắc muốn xóa toàn bộ lịch sử in của máy in này không?");
    if (!confirmation) return;

    // const token = getCookie('token');
    // if (!user_ID) {
    //     alert('Không thể xác định người dùng!');
    //     return;
    // }

    try {
        // Send DELETE request to remove all print history for the user
        const response = await fetch(`http://localhost:3000/api/d1/printconfigs/printer/${printer_ID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // 'token': `Bearer ${token}`,
            }
        });

        if (!response.ok) {
            throw new Error("Không thể xóa lịch sử in của người dùng");
        }

        // Refresh the page or update the UI to reflect the changes
        alert("Đã xóa lịch sử in của máy in thành công!");
        window.location.reload();  // Reload the page to refresh the data

    } catch (error) {
        console.error(error);
        alert("Không thể xóa lịch sử in lúc này!");
    }
};

// Add event listener for the delete button
document.querySelector('.delete-history-btn').addEventListener('click', handleDeletePrintHistory);
const showPrinterInfo = async (printer_ID) => {
    const res = window.confirm("Bạn có chắc muốn xem thông tin máy in này?");
    if (!res) return;

    // Điều hướng đến trang thông tin máy in với ID máy in
    window.location.href = `admin-info-printer.html?printer_ID=${printer_ID}`;
};

// Gọi hàm fetchPrinterInfo khi trang được tải
window.onload = fetchPrinterHistory;
// window.onload = fetchPrinterHistoryInfo2;
// Tạo sự kiện "Trở lại"
document.querySelector(".return button").addEventListener("click", () => {
    window.history.back(); // Quay lại trang trước đó
});
