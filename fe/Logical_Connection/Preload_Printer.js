document.addEventListener("DOMContentLoaded", async () => {
    const data = await fetchPrinterData();
    data.forEach((printer) =>{
        console.log(printer);

        // if(printer.status === "enable"){
        //     const loc = (printer.location.campus === null ? "" : (printer.location.campus[0] +".")) + printer.location.building[0] + "." + printer.location.room.split(" ")[1];
        //     createPrinterHTMLWith(printer.Printer_ID, printer.model, loc , printer.status === "enable" ? "Hoạt động" : "Không hoạt động");
        // }
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
