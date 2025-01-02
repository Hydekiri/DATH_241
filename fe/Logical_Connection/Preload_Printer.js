document.addEventListener("DOMContentLoaded", async () => {
    const data = await fetchPrinterData();
    //console.log(data);

    data.forEach((printer) =>{
        //console.log(printer);
        if (printer.status === "enable") {
            const loc = printer.location.building ? printer.location.building : null ;
            createPrinterHTMLWith(printer.Printer_ID, printer.model, loc, printer.status === "enable" ? "Hoạt động" : "Không hoạt động");
        }        
    });
});

async function fetchPrinterData() {
    try {
        const respone = await fetch(`http://localhost:3000/api/d1/printers`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!respone.ok) {
            alert("Failing when loading data.....");
            window.location.reload();
        }

        const data = await respone.json();
        return data.data;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

function createPrinterHTMLWith(id, model, location, status) {
    // Get the container where printers are listed
    const printerList = document.querySelector('.printers-row');  // Ensure this is the correct container

    // Build the new printer HTML string
    const printerHTML = `
        <div class="printer-display">
            <div class="printer-id">${id}</div>
            <div class="printer-model">${model}</div>
            <div class="printer-location">${location}</div>
            <div class="printer-status">${status}</div>
            <div class="printer-actions">
                <button class="choose-button">Chọn</button>
                <button class="cancel-choose-button hidden" >Hủy</button>
                <img class="success hidden" src="images/icons/success.png" alt="">
                <img class="printer-infor" src="images/icons/infor.png" alt="">
            </div>
        </div>
    `;

    // Append the new HTML to the list of printers
    printerList.insertAdjacentHTML('beforeend', printerHTML);
    addPrinterEventListeners();
}

function addPrinterEventListeners() {
    const printerList = document.querySelector('.printers-row');

    printerList.addEventListener('click', (event) => {
        // Check if the clicked element is a 'choose-button'
        if (event.target && event.target.classList.contains('choose-button')) {
            const printerDisplay = event.target.closest('.printer-display'); // Find the closest printer display container
            const id = printerDisplay.querySelector('.printer-id').textContent;
            const model = printerDisplay.querySelector('.printer-model').textContent;
            const location = printerDisplay.querySelector('.printer-location').textContent;
            const status = printerDisplay.querySelector('.printer-status').textContent;

            // Now you have the printer details, you can use them as needed
            //console.log(`Printer chosen: ID: ${id}, Model: ${model}, Location: ${location}, Status: ${status}`);
            resetAllPrinters();

            // Optionally toggle the visibility of the "choose" and "cancel" buttons
            const cancelChoose = printerDisplay.querySelector('.cancel-choose-button');
            const chooseButton = printerDisplay.querySelector('.choose-button');
            const successIcon = printerDisplay.querySelector('.success');

            chooseButton.classList.add('hidden');
            cancelChoose.classList.remove('hidden');
            successIcon.classList.remove('hidden');
        }
        if (event.target && event.target.classList.contains('cancel-choose-button')) {
            const printerDisplay = event.target.closest('.printer-display'); // Find the closest printer display container
            const id = printerDisplay.querySelector('.printer-id').textContent;
            const model = printerDisplay.querySelector('.printer-model').textContent;
            const location = printerDisplay.querySelector('.printer-location').textContent;
            const status = printerDisplay.querySelector('.printer-status').textContent;

            // Now you have the printer details, you can use them as needed
            console.log(`Cancel chosen printer: ID: ${id}, Model: ${model}, Location: ${location}, Status: ${status}`);

            // Toggle visibility back
            const cancelChoose = printerDisplay.querySelector('.cancel-choose-button');
            const chooseButton = printerDisplay.querySelector('.choose-button');
            const successIcon = printerDisplay.querySelector('.success');

            cancelChoose.classList.add('hidden');
            chooseButton.classList.remove('hidden');
            successIcon.classList.add('hidden');
        }
    });
}
  
function resetAllPrinters() {
    const allPrinters = document.querySelectorAll('.printer-display');
  
    allPrinters.forEach(printer => {
        const chooseButton = printer.querySelector('.choose-button');
        const cancelChoose = printer.querySelector('.cancel-choose-button');
        const successIcon = printer.querySelector('.success');

        chooseButton.classList.remove('hidden');
        cancelChoose.classList.add('hidden');
        successIcon.classList.add('hidden');
    });
}

document.querySelector('.printers-row').addEventListener('click', async (event) => {
    if (event.target && event.target.classList.contains('printer-infor')) {
        const printerDisplay = event.target.closest('.printer-display');
        const id = printerDisplay.querySelector('.printer-id').textContent;
        await showprinterqueue(id);
    }
});

async function showprinterqueue(id) {
    const mainDiv = document.querySelector('.main');
    const printerInfoDiv = document.querySelector('.printer-information-show');

    if (!mainDiv || !printerInfoDiv) {
        console.error('Main or printer-information-show div not found!');
        return;
    }

    // Hide main, show printer info grid
    mainDiv.style.display = 'none';
    printerInfoDiv.style.display = 'grid';

    console.log("ID = " + id);
    
    try {
        await fetchPrintConfig(id);
    } catch (error) {
        console.error('Error loading print configuration:', error);
    }
}

function backtohome(){
    const mainDiv = document.querySelector('.main');
    const printerInfoDiv = document.querySelector('.printer-information-show');

    mainDiv.style.display = 'grid';
    printerInfoDiv.style.display = 'none';
}


async function fetchPrintConfig(printer_ID) {
    try {
        const response = await fetch(`http://localhost:3000/api/d1/printconfigs/printer/${printer_ID}`);
        if (!response.ok) {
            throw new Error("Không thể lấy danh sách hàng đợi");
        }
        const data = await response.json();
        //console.log(data.data); 
        renderPrintConfig(data.data); 
    } catch (error) {
        console.error(error);
        alert("Không thể tải danh sách hàng đợi!");
    }
}

function renderPrintConfig(printconfigs) {
    const printconfigDisplay = document.querySelector('.printconfig-display');
    let html = '';
    let index = 0;

    printconfigs.forEach((printconfig) => {
        if (printconfig.status === 'completed') return;

        index++;
        const printDate = new Date(printconfig.printStart);
        const date = printDate.toLocaleDateString('vi-VN');
        const time = printDate.toLocaleTimeString('vi-VN');
        const location = (printconfig.location && printconfig.location.building) 
            ? printconfig.location.building 
            : "Không xác định";
        const docNames = printconfig.documents.map(doc => doc.name).join(', ');

        html += `
            <tr class="error">
                <td>${printconfig.user.name}<br>${printconfig.user.user_ID}</td>
                <td>${date} <br>${time}</br></td>
                <td>${index}</td>
                <td>${printconfig.documents.map(doc => doc.name).join('<br>')}
                <td>Đang đợi</td>
            </tr>
        `;
    });

    printconfigDisplay.innerHTML = html;
    if (html === '') document.querySelector('.printers-display').innerHTML += '<h3 style="text-align: center">Không có tài liệu đang đợi in</h3>';
}
