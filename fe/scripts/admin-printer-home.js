
let currentPage = 1;
let totalPages = 1;
const itemsPerPage = 5;
let allPrinters = [];


const fetchPrinters = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/d1/printers');
        if (!response.ok) {
            throw new Error("Failed to fetch printers");
        }
        const data = await response.json();
        allPrinters = data.data;
        totalPages = Math.ceil(allPrinters.length / itemsPerPage);
        renderPrinters();
        updateTotals(allPrinters);
    } catch (error) {
        console.error(error);
        alert("Không thể tải danh sách máy in!");
    }
};

const updateTotals = (printers) => {
    const totalPrinters = printers.length;
    const totalPaper = printers.reduce((sum, printer) => sum + (printer.pages_printed || 0), 0);
    const totalPrintJobs = printers.reduce((sum, printer) => sum + (printer.prints_in_day || 0), 0);
    const totalQueue = printers.reduce((sum, printer) => sum + (printer.queue || 0), 0);

    document.getElementById('total-printers').textContent = totalPrinters;
    document.getElementById('total-paper').textContent = totalPaper;
    document.getElementById('total-print-jobs').textContent = totalPrintJobs;
    document.getElementById('total-queue').textContent = totalQueue;

};
const handleToggleStatus = async (printerId, currentStatus, event) => {
    event.preventDefault();

    const overlay = document.querySelector('.overlay-2');
    const confirmButton = document.querySelector('.confirm-button');
    const cancelButton = document.querySelector('.cancel');
    const toggleCheckbox = document.querySelector(`#toggle-${printerId}`);

    overlay.classList.remove('hidden');

    toggleCheckbox.disabled = true;

    confirmButton.onclick = async () => {
        try {

            const newStatus = currentStatus === 'enable' ? 'disable' : 'enable';

            const updateResponse = await fetch(`http://localhost:3000/api/d1/printers/${printerId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: newStatus
                }),
            });

            if (!updateResponse.ok) {
                throw new Error("Không thể cập nhật trạng thái máy in");
            }

            toggleCheckbox.checked = newStatus === 'disable';
            fetchPrinters();

            overlay.classList.add('hidden');
        } catch (e) {
            console.log(e.message);
            alert("Không thể thay đổi trạng thái của máy in ngay bây giờ! Vui lòng thử lại sau!");
            overlay.classList.add('hidden');
        } finally {
            toggleCheckbox.disabled = false;
        }
    };

    cancelButton.onclick = () => {
        overlay.classList.add('hidden');
        toggleCheckbox.disabled = false;
    };
};


// const renderPrinters = (printers) => {
//     const printersRowsContainer = document.querySelector(".printers-rows");

//     printersRowsContainer.innerHTML = ''; 

//     printers.forEach(printer => {
//         const row = document.createElement("div");
//         row.classList.add("printers-row");

//         const statusClass = printer.status === 'enable' ? 'status-active' : 'status-disabled';
//         const statusText = printer.status === 'enable' ? 'Hoạt động' : 'Vô hiệu hóa';
//         const statusColor = printer.status === 'enable' ? 'color: #1EDF04; background-color: #D4FDD1;' : 'color: red; background-color: #FFCCCC;';
//         row.innerHTML = `
//             <div class="printer-checkbox-container">
//                 <input class="printer-checkbox" type="checkbox">
//             </div>

//             <div class="printer-display">
//                 <div class="printer-model">${printer.branchName}</div>
//                 <div class="printer-model">${printer.model}</div>
//                 <div class="printer-id">${printer.Printer_ID}</div>
//                 <div class="printer-location">${printer.location.building}</div>
//                 <div class="printer-weight">${printer.weight || 'N/A'}</div>
//                 <div class="printer-status" style="${statusColor}">${statusText}</div>
//                 <div class="printer-actions">
//                     <img class="printer-infor" src="images/icons/infor.png" alt="" onclick="showPrinterInfo(${printer.Printer_ID})">
//                     <img class="printer-delete" src="images/icons/delete.png" alt="" onclick="handleDelete(${printer.Printer_ID})">
//                 </div>
//             </div>

//             <div class="toggle-button-container">
//                 <input type="checkbox" id="toggle-${printer.Printer_ID}" class="toggle-checkbox" ${printer.status === 'disable' ? 'checked' : ''} onclick="handleToggleStatus(${printer.Printer_ID}, '${printer.status}')">
//                 <label for="toggle-${printer.Printer_ID}" class="toggle-label">
//                     <span class="toggle-circle"></span>
//                 </label>
//             </div>
//         `;

//         printersRowsContainer.appendChild(row);
//     });
// };
const renderPrinters = () => {
    const printersRowsContainer = document.querySelector(".printers-rows");
    printersRowsContainer.innerHTML = '';
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const printers = allPrinters.slice(start, end);

    printers.forEach(printer => {
        const row = document.createElement("div");
        row.classList.add("printers-row");

        const statusColor = printer.status === 'enable' ? 'color: #1EDF04; background-color: #D4FDD1;' : 'color: red; background-color: #FFCCCC;';
        const statusText = printer.status === 'enable' ? 'Hoạt động' : 'Vô hiệu hóa';
        row.innerHTML = `
            <div class="printer-checkbox-container">
                <input class="printer-checkbox" type="checkbox">
            </div>
            <div class="printer-display">
                <div class="printer-branchName">${printer.branchName}</div>
                <div class="printer-model">${printer.model}</div>
                <div class="printer-id">${printer.Printer_ID}</div>
                <div class="printer-location">${printer.location.building}</div>
                <div class="printer-weight">${printer.weight || 'N/A'}</div>
                <div class="printer-status" style="${statusColor}">${statusText}</div>
                <div class="printer-actions">
                    <img class="printer-infor" src="images/icons/infor.png" alt="" onclick="showPrinterInfo(${printer.Printer_ID})">
                    <img class="printer-delete" src="images/icons/delete.png" alt="" onclick="handleDelete(${printer.Printer_ID})">
                </div>
            </div>
            <div class="toggle-button-container">
                <input type="checkbox" id="toggle-${printer.Printer_ID}" class="toggle-checkbox" ${printer.status === 'disable' ? 'checked' : ''} onclick="handleToggleStatus(${printer.Printer_ID}, '${printer.status}', event)">
                <label for="toggle-${printer.Printer_ID}" class="toggle-label">
                    <span class="toggle-circle"></span>
                </label>
            </div>
        `;
        printersRowsContainer.appendChild(row);
    });

    document.getElementById('page-info').textContent = `${currentPage} / ${totalPages}`;
};

const changePage = (direction) => {
    currentPage += direction;
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    renderPrinters();
};
const showPrinterInfo = async (printer_ID) => {
    const res = window.confirm("Bạn có chắc muốn xem thông tin máy in này?");
    if (!res) return;

    // Điều hướng đến trang thông tin máy in với ID máy in
    window.location.href = `admin-info-printer.html?printer_ID=${printer_ID}`;
};

const handleDelete = async (printer_ID) => {
    const res = window.confirm("Bạn có chắc muốn xóa máy in này? Khi xóa đi rồi sẽ không thể hồi phục lại được!");
    if (!res) return;

    try {
        const deleteResponse = await fetch(`http://localhost:3000/api/d1/printers/${printer_ID}`, { method: 'DELETE' });

        if (!deleteResponse.ok) {
            throw new Error("Failed to delete printer");
        }

        fetchPrinters(); // Re-fetch and update the printer list
    } catch (e) {
        alert("Không thể xóa máy in ngay lúc này! Vui lòng thử lại sau!");
    }
};


document.querySelector(".search-input").addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase(); // Lấy giá trị nhập vào và chuyển thành chữ thường
    filterPrinters(searchTerm); // Gọi hàm lọc
});
const filterPrinters = (searchTerm) => {
    const printerRows = document.querySelectorAll(".printers-row"); // Lấy tất cả các hàng máy in

    printerRows.forEach((row) => {
        const model = row.querySelector(".printer-model").textContent.toLowerCase();
        const branchName = row.querySelector(".printer-branchName")?.textContent.toLowerCase() || '';
        const status = row.querySelector(".printer-status").textContent.toLowerCase();
        const building = row.querySelector(".printer-location").textContent.toLowerCase();
        const weight = row.querySelector(".printer-weight").textContent.toLowerCase();
        const id = row.querySelector(".printer-id").textContent.toLowerCase();
        // Kiểm tra nếu giá trị nhập khớp với bất kỳ thuộc tính nào
        if (model.includes(searchTerm) || building.includes(searchTerm) || id.includes(searchTerm) || weight.includes(searchTerm) || branchName.includes(searchTerm) || status.includes(searchTerm)) {
            row.style.display = ""; // Hiển thị hàng
        } else {
            row.style.display = "none"; // Ẩn hàng
        }
    });
};

async function loadChatWidget() {
    const response = await fetch('/fe/scripts/general/chat-widget.html');
    const chatHTML = await response.text();
    document.body.insertAdjacentHTML('beforeend', chatHTML);

    const chatPopup = document.getElementById('chatPopup');
    const minimizeButton = chatPopup.querySelector('.minimize-chat');
    const closeButton = chatPopup.querySelector('.close-chat');
    const chatBody = chatPopup.querySelector('.chat-body');

    minimizeButton.addEventListener('click', () => {
        chatBody.style.display = chatBody.style.display === 'none' ? 'block' : 'none';
    });

    closeButton.addEventListener('click', () => {
        chatPopup.style.display = 'none';
    });
}

document.querySelector(".search-input").addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredData = printerData.filter(printer =>
        printer.model.toLowerCase().includes(searchTerm) ||
        (printer.branchName && printer.branchName.toLowerCase().includes(searchTerm)) ||
        printer.status.toLowerCase().includes(searchTerm) || printer.weight.toLowerCase().includes(searchTerm) ||
        printer.location.building.toLowerCase().includes(searchTerm) || printer.id.toLowerCase().includes(searchTerm)
    );
    renderPrinters(filteredData); // Hiển thị dữ liệu đã lọc
});

// Call fetchPrinters when the page loads
window.onload = fetchPrinters;