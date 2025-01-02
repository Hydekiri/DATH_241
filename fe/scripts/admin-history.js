let currentPage = 1;
let totalPages = 1;
const itemsPerPage = 5;
let allHistory = [];
let filteredHistory = [];

const fetchPrintHistory = async () => {
    
    try {
        const response = await fetch('http://localhost:3000/api/d1/printconfigs');
        // if (printconfig.status !== 'unCompleted') return;
        if (!response.ok) {
            throw new Error("Failed to fetch print history");
        }
        const data = await response.json();
        allHistory = data.data.filter(record => record.status === "Completed");
        filteredHistory = [...allHistory];
        totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
        renderHistory();
    } catch (error) {
        console.error(error);
        alert("Không thể tải lịch sử in!");
    }
};

const renderHistory = () => {
    
    const historyContainer = document.querySelector(".printers-rows");
    historyContainer.innerHTML = '';
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageHistory = filteredHistory.slice(start, end);
    
    pageHistory.forEach(record => {
        // if (record.status !== 'unCompleted') return;
        const row = document.createElement("div");
        row.classList.add("printers-row");

        const printDate = new Date(record.printStart);
        const formattedDate = printDate.toLocaleDateString('vi-VN');
        const formattedTime = printDate.toLocaleTimeString('vi-VN');
        row.innerHTML = `
            <div class="student-name">${record.user?.name || 'N/A'}</div>
            <div class="printer-id">${record.user?.user_ID || 'N/A'}</div>
            <div class="printer-name">${record.printer?.branchName || 'N/A'}</div>
            <div class="printer-paper">${record.numPages}/ ${record.paperSize}</div>
            <div class="print-time">${formattedDate} <br> ${formattedTime}</div>
            <div class="printer-actions">
                <img class="printer-infor" src="images/icons/infor.png" alt="Info" onclick="showUserHistory('${record.user?.user_ID}', '${record.printer?.printer_ID}')">
                <img class="history-delete" src="images/icons/delete.png" alt="Delete" onclick="handleDeleteUserHistory('${record.config_ID}')">
            </div>
        `;

        historyContainer.appendChild(row);
    });

    document.getElementById('page-info').textContent = `${currentPage} / ${totalPages || 1}`;
    updatePaginationButtons();
};
const showUserHistory = async (user_ID, printer_ID) => {
    const res = window.confirm("Bạn có chắc muốn xem lịch sử in của người này?");
    if (!res) return;

    // Điều hướng đến trang thông tin lịch sử người dùng với user_ID và printerID
    window.location.href = `admin-student-history.html?user_ID=${user_ID}&printer_ID=${printer_ID}`;
};

const handleDeleteUserHistory = async (config_ID) => {
    if (!config_ID || config_ID === 'N/A') {
        alert("Không thể xác định lịch sử in!");
        return;
    }

    const confirmation = confirm("Bạn có chắc muốn xóa toàn bộ lịch sử in này không?");
    if (!confirmation) return;

    try {
        const response = await fetch(`http://localhost:3000/api/d1/printconfigs/${config_ID}`, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error("Failed to delete user history");
        }
        await fetchPrintHistory();
        alert("Đã xóa lịch sử in thành công!");
    } catch (error) {
        console.error(error);
        alert("Không thể xóa lịch sử in lúc này!");
    }
};

const changePage = (direction) => {
    const newPage = currentPage + direction;
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderHistory();
    }
};

const updatePaginationButtons = () => {
    const prevButton = document.querySelector('.prev-page');
    const nextButton = document.querySelector('.next-page');
    
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
};


document.querySelector(".search-input").addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase(); // Lấy giá trị nhập vào và chuyển thành chữ thường
    filterPrinters(searchTerm); // Gọi hàm lọc
});
const filterPrinters = (searchTerm) => {
    const printerRows = document.querySelectorAll(".printers-row"); // Lấy tất cả các hàng máy in
    let hasResult = false; // Biến để kiểm tra xem có kết quả tìm kiếm không
    // Nếu input trống, reset trạng thái
    if (!searchTerm) {
        printerRows.forEach((row) => {
            row.style.display = ""; // Hiển thị tất cả các hàng
        });
        fetchPrintHistory(); 
    }
    printerRows.forEach((row) => {
        const userName = row.querySelector(".student-name").textContent.toLowerCase();
        const printerName = row.querySelector(".printer-name").textContent.toLowerCase();
        const paper = row.querySelector(".printer-paper").textContent.toLowerCase();
        const time = row.querySelector(".print-time").textContent.toLowerCase();
        const id = row.querySelector(".printer-id").textContent.toLowerCase();

        // Kiểm tra nếu giá trị nhập khớp với bất kỳ thuộc tính nào
        if (
            userName.includes(searchTerm) ||
            printerName.includes(searchTerm) ||
            id.includes(searchTerm) ||
            paper.includes(searchTerm) ||
            time.includes(searchTerm)
        ) {
            row.style.display = ""; // Hiển thị hàng
            hasResult = true; // Có ít nhất một kết quả phù hợp
        } else {
            row.style.display = "none"; // Ẩn hàng
        }
    });

    const printersContainer = document.querySelector(".printers-rows");

    // Nếu không có kết quả phù hợp, hiển thị thông báo "Không có dữ liệu"
    if (!hasResult) {
        printersContainer.innerHTML = '<div class="no-data">Không có dữ liệu</div>';
    }
};


document.querySelector(".search-input").addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredData = historyData.filter(history => 
        history.userName.toLowerCase().includes(searchTerm) ||
        (history.printerName && history.printerName.toLowerCase().includes(searchTerm)) ||
        history.time.toLowerCase().includes(searchTerm) || history.paper.toLowerCase().includes(searchTerm) ||
        history.id.toLowerCase().includes(searchTerm)
    );
    renderHistory(filteredData); // Hiển thị dữ liệu đã lọc
});

const setupDateFilter = () => {
    const filterButton = document.getElementById('filter-button');
    filterButton.addEventListener('click', () => {
        const startDate = new Date(document.getElementById('start-date').value);
        const endDate = new Date(document.getElementById('end-date').value);
        endDate.setHours(23, 59, 59); // Include the entire end date

        if (!startDate || !endDate) {
            alert('Vui lòng chọn cả ngày bắt đầu và ngày kết thúc');
            return;
        }

        filteredHistory = allHistory.filter(record => {
            const printDate = new Date(record.printStart);
            return printDate >= startDate && printDate <= endDate;
        });

        currentPage = 1;
        totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
        renderHistory();
    });
};


// Initialize everything when the page loads
window.onload = () => {
    fetchPrintHistory();
    setupSearch();
    setupDateFilter();
};