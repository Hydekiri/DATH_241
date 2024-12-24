const fetchPrinters = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/d1/printers');
        if (!response.ok) {
            throw new Error("Failed to fetch printers");
        }
        const data = await response.json();
        renderPrinters(data.data);
    } catch (error) {
        console.error(error);
        // alert("Không thể tải danh sách máy in!");
    }
};

const renderPrinters = (printers) => {
    const printersRowsContainer = document.querySelector(".printers-rows");

    printersRowsContainer.innerHTML = ''; // Clear existing rows

    printers.forEach(printer => {
        const row = document.createElement("div");
        row.classList.add("printers-row");

        row.innerHTML = `
            <div class="printer-checkbox-container">
                <input class="printer-checkbox" type="checkbox">
            </div>

            <div class="printer-display">
                <div class="printer-model">${printer.model}</div>
                <div class="printer-id">${printer.Printer_ID}</div>
                <div class="printer-location">${printer.location.building}</div>
                <div class="printer-weight">${printer.weight || 'N/A'}</div>
                <div class="printer-status">${printer.status === 'disable' ? 'Vô hiệu hóa' : 'Hoạt động'}</div>
                <div class="printer-actions">
                    <img class="printer-infor" src="images/icons/infor.png" alt="" onclick="showPrinterInfo(${printer.Printer_ID})">
                    <img class="printer-delete" src="images/icons/delete.png" alt="" onclick="handleDelete(${printer.Printer_ID})">
                </div>
            </div>

            <div class="toggle-button-container">
                <input type="checkbox" id="toggle-${printer.Printer_ID}" class="toggle-checkbox" ${printer.status === 'disable' ? 'checked' : ''} onclick="handleTurnOff(${printer})">
                <label for="toggle-${printer.Printer_ID}" class="toggle-label">
                    <span class="toggle-circle"></span>
                </label>
            </div>
        `;

        printersRowsContainer.appendChild(row);
    });
};

const handleTurnOff = async (printer) => {
    const response = window.confirm("Bạn có chắc muốn thay đổi trạng thái của máy in?");
    if (!response) return;

    try {
        const newStatus = printer.status === 'enable' ? 'disable' : 'enable';

        const updateResponse = await fetch(`http://localhost:3000/api/d1/printers/${printer.Printer_ID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...printer,
                status: newStatus,
            }),
        });

        if (!updateResponse.ok) {
            throw new Error("Failed to update printer status");
        }

        fetchPrinters(); // Re-fetch and update the printer list
    } catch (e) {
        console.log(e.message);
        alert("Không thể thay đổi trạng thái của máy in ngay bây giờ! Vui lòng thử lại sau!");
    }
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

// Call fetchPrinters when the page loads
window.onload = fetchPrinters;
