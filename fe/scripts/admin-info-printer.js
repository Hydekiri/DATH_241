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
        renderPrinterInfo2(data.data); // Render thông tin chi tiết
    } catch (error) {
        console.error(error);
        alert("Không thể tải thông tin máy in!");
    }
};

// Hàm render thông tin chung của máy in
const renderPrinterInfo = (printer) => {
    document.querySelector(".IDPrinter").textContent = `ID: ${printer.Printer_ID}`;
    document.querySelector(".model").textContent = `Model: ${printer.model}`;
    document.querySelector(".location").textContent = `Vị trí: ${printer.location.building}`;
    document.querySelector(".wei").textContent = `Trọng Lượng: ${printer.weight || 'N/A'}`;
    
    const statusText = printer.status === 'enable' ? 'Hoạt động' : 'Vô hiệu hóa';
    document.querySelector(".status span").textContent = `Trạng thái: ${statusText}`;
    
    // Lịch sử in
    const historyContainer = document.querySelector(".history-container");
    historyContainer.innerHTML = `
        <a href="#">Chi tiết</a>
        <i class="fas fa-info-circle printer-infor" style="font-size: 24px; color: #ffffff; margin-right: 10px;"></i>
    `;
};

// Hàm render thông tin chi tiết của máy in
const renderPrinterInfo2 = (printer) => {
    document.querySelector(".printermodel").textContent = `Kiểu máy in: ${printer.printer_type || '0'}`;
    document.querySelector(".queue").textContent = `Hàng đợi: ${printer.queue || '0'}`;
    document.querySelector(".printInDay").textContent = `Số lượt in trong ngày: ${printer.prints_in_day || '0'}`;
    document.querySelector(".numPage").textContent = `Số lượng giấy in: ${printer.pages_printed || '0'}`;
    document.querySelector(".printColor").textContent = `In màu: ${printer.color_print === 'yes' ? 'Có' : 'Không'}`;
    document.querySelector(".size").textContent = `Kích thước: ${printer.size || '0'}`;
    document.querySelector(".HD").textContent = `Độ phân giải: ${printer.resolution || '0'}`;
    document.querySelector(".ink").textContent = `Loại mực: ${printer.ink_type || '0'}`;
    
    // Xử lý khổ giấy hỗ trợ
    const paperSizes = printer.paper_size ? printer.paper_size.split(', ') : ['N/A'];
    document.querySelector(".Apage").textContent = `Khổ giấy hỗ trợ: ${paperSizes.join(", ")}`;
};



// Gọi hàm fetchPrinterInfo khi trang được tải
window.onload = fetchPrinterInfo;

// Tạo sự kiện "Trở lại"
document.querySelector(".return button").addEventListener("click", () => {
    window.history.back(); // Quay lại trang trước đó
});
