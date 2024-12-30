const urlParams = new URLSearchParams(window.location.search);
const printer_ID = urlParams.get('printer_ID');
let printerStatus;
let printerPage;
let branchName1, model1, description1, status1, weight1, printer_type1, queue1, prints_in_day1, pages_printed1, color_print1, printer_size1, paper_size1, resolution1, ink_type1, location1;

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

    } catch (error) {
        console.error(error);
        alert("Không thể tải thông tin máy in!");
    }
};

// Hàm render thông tin chung của máy in
const renderPrinterInfo = (printer) => {
    printerStatus = printer.status;
    printerPage = printer.pages_printed;

    branchName1 = printer.branchName;
    model1 = printer.model;
    description1 = printer.description;
    status1 = printer.status;
    weight1 = printer.weight;
    printer_type1 = printer.printer_type;
    queue1 = printer.model;
    prints_in_day1 = printer.prints_in_day;
    pages_printed1 = printer.pages_printed;
    color_print1 = printer.color_print;
    printer_size1 = printer.printer_size;
    paper_size1 = printer.paper_size;
    resolution1 = printer.resolution;
    ink_type1 = printer.ink_type;
    location1 = printer.location;

    console.log(location1);

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
        <a href="#" onclick="showPrinterHistoryInfo(${printer.Printer_ID})">Chi tiết</a>
        <i class="fas fa-info-circle printer-infor" style="font-size: 24px; color: #ffffff; margin-right: 10px;"></i>
    `;
};

const showPrinterHistoryInfo = async (printer_ID) => {
    const res = window.confirm("Bạn có chắc muốn xem lịch sử của máy in này?");
    if (!res) return;

    // Điều hướng đến trang thông tin máy in với ID máy in
    window.location.href = `admin-printer-history.html?printer_ID=${printer_ID}`;
};



async function fetchPrintConfig() {
    try {
        const response = await fetch(`http://localhost:3000/api/d1/printconfigs/printer/${printer_ID}`);
        if (!response.ok) {
            throw new Error("Không thể lấy danh sách hàng đợi");
        }
        const data = await response.json();
        console.log(data.data); 
        renderPrintConfig(data.data); 
    } catch (error) {
        console.error(error);
        alert("Không thể tải danh sách hàng đợi!");
    }
}

function renderPrintConfig(printconfigs) {
    if (printerStatus != "enable")
    {
        document.querySelector('.printers-display').innerHTML += '<h1 style="text-align: center">Máy in hiện không khả dụng!</h1>';
        return;
    }

    const printconfigDisplay = document.querySelector('.printconfig-display');
    let html = '';
    let index = 0;

    printconfigs.forEach((printconfig) => {
        if (printconfig.status !== 'unCompleted') return;

        index++;
        //Tinh toan lai dinh dang thoi gian
        const datetimeStr = printconfig.printStart;
        const [date, timeWithTimezone] = datetimeStr.split('T');
        const time = timeWithTimezone.replace('.000Z', '');


        //Tinh so luong giay can in
        let paperToPrint = printconfig.printSide === 'one-side' ? printconfig.numPages : Math.ceil(printconfig.numPages / 2);

        if (printconfig.paperSize === 'A3') paperToPrint *= 2;

        paperToPrint *= printconfig.numCopies;

        console.log(paperToPrint);

        html += `
            <tr class="success">
                <td>${printconfig.user.name}<br>${printconfig.user.user_ID}</td>
                <td>${date} <br>${time}</br></td>
                <td>${index}</td>
                <td>${paperToPrint} <br>${printconfig.paperSize}</br></td>
                <td>${printconfig.documents.map(doc => doc.name).join('<br>')}<br>Đã kiểm duyệt</td>
                <td class="print-action"><button class="print-button" onclick="handlePrintButton(${printconfig.config_ID}, '${paperToPrint}')">In</button></td>
            </tr>
        `;
    });

    printconfigDisplay.innerHTML = html;
    if (html === '') document.querySelector('.printers-display').innerHTML += '<h1 style="text-align: center">Không có tài liệu đang đợi in</h1>';
}

async function updatePrinter(printerPage) {
    printerPage = Number(printerPage);

    try {
        console.log(printerPage);
        console.log({
            branchName: branchName1,
            model: model1,
            description: description1,
            status: status1,
            weight: weight1,
            printer_type: printer_type1, 
            queue: queue1,              
            prints_in_day: prints_in_day1 + 1, 
            pages_printed: printerPage, 
            color_print: color_print1,   
            printer_size: printer_size1,  
            paper_size: paper_size1,     
            resolution: resolution1,      
            ink_type: ink_type1, 
            location: location
        });

        const dataToUpdate = {
            branchName: branchName1,
            model: model1,
            description: description1,
            status: status1,
            weight: weight1,
            printer_type: printer_type1, 
            queue: queue1,              
            prints_in_day: prints_in_day1 + 1, 
            pages_printed: printerPage, 
            color_print: color_print1,   
            printer_size: printer_size1,  
            paper_size: paper_size1,     
            resolution: resolution1,      
            ink_type: ink_type1, 
            location: location1
        };

        const response = await fetch(`http://localhost:3000/api/d1/printers/${printer_ID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataToUpdate)
        });
        if (!response.ok) {
            throw new Error("Không thể cập nhật máy in!");
        }

        alert('cap nhat may in thanh cong');
    }
    catch {
        console.error("Lỗi khi cập nhật máy in:", error);
        alert("Có lỗi xảy ra khi cập nhật máy in.");
    }
}

async function handlePrintButton(config_ID, paperNeeded) {
    const confirmPrint = window.confirm("Xác nhận in tài liệu này?");
    if (!confirmPrint) return;

    paperNeeded = Number(paperNeeded);

    console.log(paperNeeded);

    if (paperNeeded > printerPage) {
        alert('Máy in không đủ giấy, hãy nạp thêm!');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/d1/printconfigs/${config_ID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status: "Completed" })
        });

        if (!response.ok) {
            throw new Error("Không thể cập nhật trạng thái cấu hình in!");
        }

        await updatePrinter(`${printerPage - paperNeeded}`);

        alert("In thành công và trạng thái đã được cập nhật.");
        fetchPrintConfig();
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái in:", error);
        alert("Có lỗi xảy ra khi đánh dấu trạng thái.");
    }
}

// Gọi hàm fetchPrinterInfo khi trang được tải
window.onload = async () => {
    await fetchPrinterInfo();
    fetchPrintConfig();   
}

// Tạo sự kiện "Trở lại"
document.querySelector(".return button").addEventListener("click", () => {
    window.history.back(); // Quay lại trang trước đó
});
