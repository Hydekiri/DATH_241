const overlay = document.querySelector('.overlay');
const form = document.querySelector('.form');
const overlay2 = document.querySelector('.overlay-2');
const cancel = document.querySelector('.cancel');
const confirmButton = document.querySelector('.confirm-button');
const urlParams = new URLSearchParams(window.location.search);
const printer_ID = urlParams.get('printer_ID');

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

// const fetchPrinter = async () => {
//     if (!printer_ID) {
//         alert("No printer ID provided.");
//         return;
//     }

//     try {
//         const response = await fetch(`http://localhost:3000/api/d1/printers/${printer_ID}`);
//         if (!response.ok) {
//             throw new Error("Không thể lấy thông tin máy in");
//         }
//         const data = await response.json();
//         console.log(data); // Xử lý dữ liệu máy in ở đây
//         renderPrinter(data.data); // Render thông tin chung

//     } catch (error) {
//         console.error(error);
//         alert("Không thể tải thông tin máy in!");
//     }
// };

// const renderPrinter = (printer) => {
//     const printersRowsContainer = document.querySelector(".overlay");

//     printersRowsContainer.innerHTML = ''; // Clear any previous content

//     const row = document.createElement("div");
//     row.classList.add("printers-row");

//     const statusClass = printer.status === 'enable' ? 'status-active' : 'status-disabled';
//     const statusText = printer.status === 'enable' ? 'Hoạt động' : 'Vô hiệu hóa';
//     row.innerHTML = `
//         <form action="" class="add-printer-container form">
//             <div class="add-form-left">
//                 <h2>Thêm máy in mới</h2>
//                 <div class="input-row">
//                     <label for="model" class="left-label">Model:</label>
//                     <input id="model" class="left-input" type="text" value="${printer.model}" required>
//                 </div>
//                 <div class="input-row">
//                     <label for="branchName" class="left-label">BranchName:</label>
//                     <input id="branchName" class="left-input" type="text" value="${printer.branchName}" required>
//                 </div>
//                 <div class="input-row">
//                     <label for="location" class="left-label">Vị trí:</label>
//                     <input id="location" class="left-input" type="text" value="${printer.location.building}" required>
//                 </div>
//                 <div class="input-row">
//                     <label for="weight" class="left-label">Trọng lượng:</label>
//                     <input id="weight" class="left-input" type="text" value="${printer.weight}" required>
//                 </div>
//                 <div class="input-row">
//                     <label for="description" class="left-label">Mô tả:</label>
//                     <input id="description" class="left-input" type="text" value="${printer.description}" required>
//                 </div>
//                 <div class="input-row">
//                     <label for="printer_type" class="middle-label">Kiểu máy in:</label>
//                     <input id="printer_type" class="middle-input" type="text" value="${printer.printer_type}" required>
//                 </div>
//                 <div class="input-row">
//                     <label for="queue" class="middle-label">Hàng đợi:</label>
//                     <input id="queue" class="middle-input" type="number" value="${printer.queue}" required>
//                 </div>
//                 <div class="input-row">
//                     <label for="status" class="middle-label">Trạng thái:</label>
//                     <select id="status" class="middle-input" required>
//                         <option value="enable" ${printer.status === 'enable' ? 'selected' : ''}>Có</option>
//                         <option value="disable" ${printer.status === 'disable' ? 'selected' : ''}>Không</option>
//                     </select>
//                 </div>
//             </div>

//             <div class="add-form-middle">
//                 <h2>Tes</h2>
//                 <div class="input-row">
//                     <label for="prints_in_day" class="middle-label">Số lượt in trong ngày:</label>
//                     <input id="prints_in_day" class="middle-input" type="number" value="${printer.prints_in_day}" required>
//                 </div>
//                 <div class="input-row">
//                     <label for="pages_printed" class="middle-label">Số lượng giấy in:</label>
//                     <input id="pages_printed" class="middle-input" type="number" value="${printer.pages_printed}" required>
//                 </div>
//                 <div class="input-row">
//                     <label for="color_print" class="middle-label">In màu:</label>
//                     <select id="color_print" class="middle-input" required>
//                         <option value="no" ${printer.color_print === 'no' ? 'selected' : ''}>Không</option>
//                         <option value="yes" ${printer.color_print === 'yes' ? 'selected' : ''}>Có</option>
//                     </select>
//                 </div>
//                 <div class="input-row">
//                     <label for="printer_size" class="middle-label">Kích thước:</label>
//                     <input id="printer_size" class="middle-input" type="text" value="${printer.printer_size}" required>
//                 </div>
//                 <div class="input-row">
//                     <label for="resolution" class="middle-label">Độ phân giải:</label>
//                     <input id="resolution" class="middle-input" type="text" value="${printer.resolution}" required>
//                 </div>
//                 <div class="input-row">
//                     <label for="ink_type" class="middle-label">Loại mực:</label>
//                     <input id="ink_type" class="middle-input" type="text" value="${printer.ink_type}" required>
//                 </div>
//                 <div class="input-row">
//                     <label for="paper_size" class="middle-label">Khổ giấy hỗ trợ:</label>
//                     <input id="paper_size" class="middle-input" type="text" value="${printer.paper_size}" required>
//                 </div>
//                 <div class="add-status2">
//                     <span>Trạng thái:</span>
//                     <div class="toggle-button-container">
                        
//                     </div>
//                 </div>
//             </div>

//             <div class="add-form-right">
//                 <img src="images/add-printer.png" alt="">
//                 <div class="buttons">
//                     <button type="reset" class="reset-button">Đặt lại</button>
//                     <button type="submit" class="submit-button">Xác nhận</button>
//                 </div>
//             </div>
//         </form>
//     `;
//     printersRowsContainer.appendChild(row);
// };
// window.onload = fetchPrinter;

// Xác nhận chỉnh sửa
confirmButton.addEventListener('click', async () => {
    const formValues = document.querySelectorAll('.form input, .form select');
    const printerData = {};

    // Collect input values
    formValues.forEach(input => {
        const key = input.id;
        let value = input.value.trim();
        printerData[key] = input.type === 'number' ? Number(value) || null : value || null;
    });

    // Ensure location is properly structured
    if (printerData.location && typeof printerData.location === 'string') {
        printerData.location = { building: printerData.location };
    }

    // Validate required fields
    const requiredFields = ['branchName', 'model', 'status', 'location'];
    for (const field of requiredFields) {
        if (!printerData[field]) {
            alert(`Field "${field}" is required!`);
            return;
        }
    }

    console.log('Data to send:', printerData);

    // Send PUT request
    try {
        const response = await fetch(`http://localhost:3000/api/d1/printers/${printer_ID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(printerData), // Corrected payload
        });

        if (response.ok) {
            alert('Printer updated successfully!');
            window.location.href = 'admin-printer-home.html';
        } else {
            const errorText = await response.text();
            alert(`Server Error: ${errorText}`);
        }
    } catch (error) {
        console.error('Connection Error:', error);
        alert('Failed to connect to the server.');
    }
});




