const overlay = document.querySelector('.overlay');
const form = document.querySelector('.form');
const overlay2 = document.querySelector('.overlay-2');
const cancel = document.querySelector('.cancel');
const confirmButton = document.querySelector('.confirm-button');
const urlParams = new URLSearchParams(window.location.search);
const printer_ID = urlParams.get('printer_ID');
let originalPrinterData = null; 
console.log(printer_ID);

// Đóng overlay khi nhấp ra ngoài
overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.add('hidden');
});

// Hiển thị xác nhận khi nhấn submit
form.addEventListener('submit', (event) => {
    event.preventDefault();
    overlay2.classList.remove('hidden');
});

// Đóng overlay xác nhận
cancel.addEventListener('click', () => {
    overlay2.classList.add('hidden');
});

// Fetch thông tin máy in và điền vào form
const fetchPrinterInfo = async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/d1/printers/${printer_ID}`);
        if (!response.ok) {
            throw new Error("Không thể lấy thông tin máy in");
        }
        const data = await response.json();
        originalPrinterData = data.data; // Save original data
        populateForm(originalPrinterData);
    } catch (error) {
        console.error(error);
        alert("Không thể tải thông tin máy in!");
    }
};

// Điền thông tin vào form
const populateForm = (printer) => {
    // Điền thông tin cơ bản
    document.getElementById('model').value = printer.model || '';
    document.getElementById('branchName').value = printer.branchName || '';
    document.getElementById('location').value = printer.location?.building || '';
    document.getElementById('weight').value = printer.weight || '';
    document.getElementById('description').value = printer.description || '';
    
    // Điền thông tin kỹ thuật
    document.getElementById('printer_type').value = printer.printer_type || '';
    document.getElementById('queue').value = printer.queue || 0;
    document.getElementById('status').value = printer.status || 'enable';
    document.getElementById('prints_in_day').value = printer.prints_in_day || 0;
    document.getElementById('pages_printed').value = printer.pages_printed || 0;
    document.getElementById('color_print').value = printer.color_print || 'no';
    document.getElementById('printer_size').value = printer.printer_size || '';
    document.getElementById('resolution').value = printer.resolution || '';
    document.getElementById('ink_type').value = printer.ink_type || '';
    document.getElementById('paper_size').value = printer.paper_size || '';
};
document.querySelector('.reset-button').addEventListener('click', (e) => {
    e.preventDefault();
    if (originalPrinterData) {
        populateForm(originalPrinterData);
    }
});
// Xử lý xác nhận chỉnh sửa
confirmButton.addEventListener('click', async () => {
    const formData = {
        model: document.getElementById('model').value,
        branchName: document.getElementById('branchName').value,
        location: { building: document.getElementById('location').value },
        weight: document.getElementById('weight').value,
        description: document.getElementById('description').value,
        printer_type: document.getElementById('printer_type').value,
        queue: parseInt(document.getElementById('queue').value),
        status: document.getElementById('status').value,
        prints_in_day: parseInt(document.getElementById('prints_in_day').value),
        pages_printed: parseInt(document.getElementById('pages_printed').value),
        color_print: document.getElementById('color_print').value,
        printer_size: document.getElementById('printer_size').value,
        resolution: document.getElementById('resolution').value,
        ink_type: document.getElementById('ink_type').value,
        paper_size: document.getElementById('paper_size').value
    };

    try {
        const response = await fetch(`http://localhost:3000/api/d1/printers/${printer_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Cập nhật thông tin máy in thành công!');
            window.location.href = 'admin-printer-home.html';
        } else {
            const errorText = await response.text();
            alert(`Lỗi cập nhật: ${errorText}`);
        }
    } catch (error) {
        console.error('Lỗi kết nối:', error);
        alert('Không thể kết nối đến máy chủ.');
    }
});

// Xử lý nút quay lại
document.querySelector(".return button").addEventListener("click", () => {
    window.history.back();
});

// Load dữ liệu khi trang được tải
window.onload = fetchPrinterInfo;