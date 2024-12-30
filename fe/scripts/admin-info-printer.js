// Lấy printer_ID từ URL
const urlParams = new URLSearchParams(window.location.search);
const printer_ID = urlParams.get('printer_ID');

console.log(printer_ID); // Hiển thị printer_ID lên console



// Fetch thông tin máy in và hiển thị
const fetchPrinterInfo = async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/d1/printers/${printer_ID}`);
        if (!response.ok) {
            throw new Error("Không thể lấy thông tin máy in");
        }
        const data = await response.json();
        console.log(data); // Xử lý dữ liệu máy in ở đây
        renderPrinterInfo(data.data); // Render thông tin chung
        renderPrinterInfo2(data.data);

        checkAndResetPrintCount(data.data.last_reset);

    } catch (error) {
        console.error(error);
        alert("Không thể tải thông tin máy in!");
    }
};
const checkAndResetPrintCount = async (lastReset) => {
    const now = new Date();
    const lastResetDate = new Date(lastReset);
    const hoursDiff = Math.abs(now - lastResetDate) / 36e5; // Convert to hours

    if (hoursDiff >= 24) {
        try {
            const response = await fetch(`http://localhost:3000/api/d1/printers/${printer_ID}/resetPrintInDay`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Reset failed');
            }
            
            // Refresh printer info after reset
            fetchPrinterInfo();
        } catch (error) {
            console.error('Error resetting print count:', error);
        }
    }
}

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
        <i class="fas fa-info-circle printer-infor" style="font-size: 24px; color: #ffffff; margin-right: 10px;"onclick="showPrinterHistoryInfo(${printer.Printer_ID})"></i>
    `;
};

// Hàm render thông tin chi tiết của máy in
const renderPrinterInfo2 = (printer) => {
    document.querySelector(".printermodel").innerHTML = `<span>Kiểu máy in:</span> ${printer.printer_type || '0'}`;
    document.querySelector(".queue").innerHTML = `<span>Hàng đợi:</span> ${printer.queue || '0'}`;
    document.querySelector(".printInDay").innerHTML = `<span>Số lượt in trong ngày: </span>${printer.prints_in_day || '0'}`;
    document.querySelector(".numPage").innerHTML = `<span>Số lượng giấy in:</span> ${printer.pages_printed || '0'}`;
    document.querySelector(".printColor").innerHTML = `<span>In màu: </span>${printer.color_print === 'yes' ? 'Có' : 'Không'}`;
    document.querySelector(".size").innerHTML = `<span>Kích thước: </span>${printer.printer_size || '0'}`;
    document.querySelector(".HD").innerHTML = `<span>Độ phân giải: </span>${printer.resolution || '0'}`;
    document.querySelector(".ink").innerHTML = `<span>Loại mực: </span>${printer.ink_type || '0'}`;
    
    // Xử lý khổ giấy hỗ trợ
    const paperSizes = printer.paper_size ? printer.paper_size.split(', ') : ['N/A'];
    document.querySelector(".Apage").innerHTML = `<span>Khổ giấy hỗ trợ: </span>${paperSizes.join(", ")}`;
};


const showPrinterHistoryInfo = async (printer_ID) => {
    const res = window.confirm("Bạn có chắc muốn xem lịch sử của máy in này?");
    if (!res) return;

    // Điều hướng đến trang thông tin máy in với ID máy in
    window.location.href = `admin-printer-history.html?printer_ID=${printer_ID}`;
};
document.querySelector(".edit a").addEventListener("click", (e) => {
    e.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>

    if (printer_ID) {
        // Chuyển hướng đến trang chỉnh sửa kèm theo printer_ID
        window.location.href = `admin-edit-printer.html?printer_ID=${printer_ID}`;
    } else {
        alert("Không tìm thấy ID máy in!");
    }
});



// Gọi hàm fetchPrinterInfo khi trang được tải
window.onload = fetchPrinterInfo;

// Tạo sự kiện "Trở lại"
document.querySelector(".return button").addEventListener("click", () => {
    window.history.back(); // Quay lại trang trước đó
});

