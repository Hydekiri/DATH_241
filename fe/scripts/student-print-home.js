const form = document.querySelector("form"),
  fileInput = document.querySelector(".file-input"),
  uploadedArea = document.querySelector(".uploaded-area");

let file_inf = [];

form.addEventListener("click", () => {
  fileInput.click();
});

fileInput.onchange = ({ target }) => {
  let files = target.files;
  Array.from(files).forEach(file => {
    let fileName = file.name;
    if (fileName.length >= 14) {
      let splitName = fileName.split('.');
      fileName = splitName[0].substring(0, 15) + "... ." + splitName[1];
    }
    displayFile(fileName, file);
  });
};

function displayFile(name, file) {
  let fileSize = (file.size / 1024 / 1024).toFixed(2) + " MB"; // Convert bytes to MB
  let uploadedHTML = `<li class="row">
                        <div class="content upload">
                          <i class="fas fa-file-alt"></i>
                          <div class="details">
                            <span class="name">${name}</span>
                            <span class="size">${fileSize}</span>
                          </div>
                        </div>
                        <img class="file-delete-button" src="images/icons/delete.png" onclick="deleteimg(event, '${name}')"></img>
                      </li>`;
  uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);

  file_inf.push({ name: name, size: (file.size / 1024 / 1024).toFixed(2) });
}

function deleteimg(event, name) {
  file_inf = file_inf.filter(file => file.name !== name);
  event.target.closest('li').remove();
}


const nextButton = document.querySelector('.next'),
  step1Div = document.querySelector('.step-1'),
  step2Div = document.querySelector('.step-2'),
  choosePrinterDiv = document.querySelector('.choose-printer'),
  settingPageDiv = document.querySelector('.setting-page');

nextButton.addEventListener('click', showChoosePrinter);
step2Div.addEventListener('click', showChoosePrinter);

step1Div.addEventListener('click', showSettingPage);

function showChoosePrinter() {
  settingPageDiv.classList.add('hidden');
  choosePrinterDiv.classList.remove('hidden');
  step2Div.classList.add('show');
  step1Div.classList.remove('show');
}

function showSettingPage() {
  choosePrinterDiv.classList.add('hidden');
  settingPageDiv.classList.remove('hidden');
  step1Div.classList.add('show');
  step2Div.classList.remove('show');
}

const chooseButton = document.querySelector('.choose-button'),
  cancelChoose = document.querySelector('.cancel-choose-button'),
  successIcon = document.querySelector('.success');

chooseButton.addEventListener('click', () => {
  chooseButton.classList.add('hidden');
  cancelChoose.classList.remove('hidden');
  successIcon.classList.remove('hidden');
});

cancelChoose.addEventListener('click', () => {
  chooseButton.classList.remove('hidden');
  cancelChoose.classList.add('hidden');
  successIcon.classList.add('hidden');
});

const printerList = document.querySelector('.printers-row');
let Printer_ID = 0;


printerList.addEventListener('click', (event) => {
  // Check if the clicked element is a 'choose-button'
  if (event.target && event.target.classList.contains('choose-button')) {
    const printerDisplay = event.target.closest('.printer-display'); // Find the closest printer display container
    const id = printerDisplay.querySelector('.printer-id').textContent;
    console.log("Printer ID has been selected : " + id);
    Printer_ID = id;
  }
});

const confirm_button = document.querySelector('.confirm-button');

confirm_button.addEventListener('click', async () => {
  if (file_inf.length === 0) {
    alert("Vui lòng tải lên ít nhất một tệp trước khi xác nhận!");
    return;
  }

  const page_orientation = document.getElementById('orientation').value;
  const number_of_page = document.getElementById('page-num').value;
  const number_of_copy = document.getElementById('copies').value;
  const type_of_print = document.getElementById('print-type').value;
  const paper_type = document.getElementById('paper-size').value;
  //console.log(page_orientation + "-" + number_of_page + "-" + number_of_copy + "-" + type_of_print + "-" + paper_type);

  if(Printer_ID === 0) {
    alert("Hãy chọn máy in trước !");
  }
  const configID = await createPrintConfigWith(page_orientation, number_of_page, number_of_copy, type_of_print, paper_type, Printer_ID);

  if(!configID) return;

  ///for each element in file_inf                                             
  file_inf.forEach((doc) => {
    //console.log(doc.name + "----" + doc.size);
    createDocumentWith(doc.name, doc.size, configID);
  })

  alert("Đăng kí thành công !");
  window.location.reload();
});

function getCookie(name) {
  let value = `; ${document.cookie}`;
  let parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;  // If cookie not found
}

async function createDocumentWith(DocName, DocSize, configID) {
  const currentDate = new Date();
  let formattedDate = currentDate.getFullYear() + "-" +
    ("0" + (currentDate.getMonth() + 1)).slice(-2) + "-" +
    ("0" + currentDate.getDate()).slice(-2) + " " +
    ("0" + currentDate.getHours()).slice(-2) + ":" +
    ("0" + currentDate.getMinutes()).slice(-2) + ":" +
    ("0" + currentDate.getSeconds()).slice(-2);

  const token = getCookie('token');
  //console.log(token);

  try {
    const respone = await fetch("http://localhost:3000/api/d1/documents", {
      method: "POST",
      body: JSON.stringify({
        "config_ID": configID,
        "name": DocName,
        "size": DocSize,
        "lastModifiedDate": formattedDate
      }),
      headers: {
        "Content-Type": "application/json",
        "token": `Bearer ${token}`
      }
    });
    if (respone.ok) console.log("Successfully !");
    else console.log("Failing add new Document !");
  }
  catch (error) {
    console.error(error);
    alert("Failing create new Document !");
  }
}

async function createPrintConfigWith(page_orientation, number_of_page, number_of_copy, type_of_print, paper_type, printer_ID) {
  //get User to check If balance Pages are available
  const userID = parseInt(getCookie('id'));
  const token = getCookie('token');
  try {
    const respone = await fetch(`http://localhost:3000/api/d1/users/${userID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "token": `Bearer ${token}`
      }
    });
    if (!respone.ok) console.log("Failing Getting User by ID for create config!");

    const data = await respone.json();
    const user = data.data;
    if (!user) throw error("The user is invalid for Creating PrintConfig!");

    const balancepage = user.pageBalance;
    if (balancepage < number_of_page * number_of_copy) {
      alert("You don't have enough page for printing ! Please Buy More !");
      window.location.href = './student-buy.html';
      return;
    }
    else{
      const updt = await substractPageBalance(balancepage - number_of_page * number_of_copy);
      if(!updt) {
        alert("Failing update PageBlance for Printing !");
        return;
      }
    }
  }
  catch (error) {
    console.error(error);
    throw error;
  }

  //create PrintConfig
  try {
    const respone = await fetch("http://localhost:3000/api/d1/printconfigs", {
      method: "POST",
      body: JSON.stringify({
        "user_ID": userID,
        "printer_ID": printer_ID,
        "numPages": number_of_page,
        "numCopies": number_of_copy,
        "paperSize": paper_type,
        "printSide": type_of_print,
        "orientation": page_orientation,
        "status": "unCompleted"
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!respone.ok) console.log("Failing add new PrintConfig !");

    const data = await respone.json();
    const cfID = data.data.config_ID;
    return cfID;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

async function substractPageBalance(pgNum) {
  const userID = parseInt(getCookie('id'));
  const token = getCookie('token');
  try {
    const respone = await fetch(`http://localhost:3000/api/d1/users/${userID}`, {
      method: "PUT",
      body : JSON.stringify({
        "pageBalance" : pgNum 
      })
      ,
      headers: {
        "Content-Type": "application/json",
        "token": `Bearer ${token}`
      }
    });
    if(!respone.ok) return "Failing update PageNumber !";

    return true;


  }catch(error){
    console.error(error);
    return false;
  }
}