const form = document.querySelector("form"),
  fileInput = document.querySelector(".file-input"),
  uploadedArea = document.querySelector(".uploaded-area");

let file_inf = [];


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

// Gọi hàm loadChatWidget() để tải khung chat khi trang được load
//loadChatWidget();


form.addEventListener("click", () => {
  fileInput.click();
});

fileInput.onchange = ({ target }) => {
  let files = target.files;
  Array.from(files).forEach(async (file) => {
    let fileName = file.name;
    if (fileName.length >= 14) {
      let splitName = fileName.split('.');
      fileName = splitName[0].substring(0, 15) + "... ." + splitName[1];
    }
    await displayFile(fileName, file);
  });
};

async function displayFile(name, file) {
  let fileSize = (file.size / 1024 / 1024).toFixed(2) + " MB"; // Convert bytes to MB
  const pagecnt = await getPdfPageCount(file);
  file_inf.push({ name: name, size: (file.size / 1024 / 1024).toFixed(2), pagecount: pagecnt });

  // Tạo URL tạm thời cho file để xem
  const fileURL = URL.createObjectURL(file);

  let uploadedHTML = `<li class="row">
                        <div class="content upload">
                          <i class="fas fa-file-alt"></i>
                          <div class="details">
                            <span class="name">${name} - Số trang : ${pagecnt}</span>
                            <span class="size">${fileSize}<a href="${fileURL}" target="_blank" class="view-file-button">      Xem file</a></span>
                          </div>
                        </div>
                        <img class="file-delete-button" src="images/icons/delete.png" onclick="deleteimg(event, '${name}')"></img>
                      </li>`;
  uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
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
  const pageRange = document.getElementById('page-num').value;
  const PageCountProcess = StringProcess(pageRange);

  if (PageCountProcess === -1) {
    alert("Định dạng chưa đúng hoặc số trang bắt đầu / kết thúc không hợp lệ !");
    return;
  }

  let number_of_page = PageCountProcess.endpg - PageCountProcess.startpg + 1;
  if (number_of_page === 0) {
    alert("Số trang bằng 0, vui lòng nhập lại số trang chọn");
    return;
  }

  const number_of_copy = document.getElementById('copies').value;
  const type_of_print = document.getElementById('print-type').value;
  const paper_type = document.getElementById('paper-size').value;
  //console.log(page_orientation + "-" + number_of_page + "-" + number_of_copy + "-" + type_of_print + "-" + paper_type);
  if (type_of_print === "both-side") {
    number_of_page = parseInt(number_of_page / 2);
    if (number_of_page === 0) number_of_page += 1;
  }
  if (paper_type === "A3") {
    number_of_page = parseInt(number_of_page * 2);
    if (number_of_page === 0) number_of_page += 1;
  }

  if (Printer_ID === 0) {
    alert("Hãy chọn máy in trước !");
    return;
  }
  const configID = await createPrintConfigWith(page_orientation, number_of_page, number_of_copy, type_of_print, paper_type, Printer_ID);

  if (!configID) return;

  ///for each element in file_inf  
  let isValid = true;

  for (const doc of file_inf) {
    if (PageCountProcess.startpg > doc.pagecount) {
      alert("Định dạng chọn trang chưa hợp lệ vui lòng chọn lại");
      isValid = false;
      break;
    } else {
      await createDocumentWith(doc.name, doc.size, configID, number_of_page, number_of_copy);
    }
  }

  if (isValid) {
    alert("Đăng kí thành công!");
    window.location.reload();
  }

});

function getCookie(name) {
  let value = `; ${document.cookie}`;
  let parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;  // If cookie not found
}

async function createDocumentWith(DocName, DocSize, configID, number_of_page, number_of_copy) {
  const currentDate = new Date();
  let formattedDate = currentDate.getFullYear() + "-" +
    ("0" + (currentDate.getMonth() + 1)).slice(-2) + "-" +
    ("0" + currentDate.getDate()).slice(-2) + " " +
    ("0" + currentDate.getHours()).slice(-2) + ":" +
    ("0" + currentDate.getMinutes()).slice(-2) + ":" +
    ("0" + currentDate.getSeconds()).slice(-2);

  const token = getCookie('token');
  //console.log(token);
  //get User to check If balance Pages are available
  const userID = parseInt(getCookie('id'));
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
    //console.log(data.data.pageBalance);
    const user = data.data;
    if (!user) throw error("The user is invalid for Creating PrintConfig!");

    const balancepage = user.pageBalance;
    if (balancepage < number_of_page * number_of_copy) {
      alert("You don't have enough page for printing ! Please Buy More !");
      window.location.href = './student-buy.html';
      return;
    }
    else {
      const updt = await substractPageBalance(balancepage - number_of_page * number_of_copy);
      if (!updt) {
        alert("Failing update PageBlance for Printing !");
        return;
      }
    }
  }
  catch (error) {
    console.error(error);
    throw error;
  }

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
  const userID = parseInt(getCookie('id'));

  // Update queue
  try {
    const response11 = await fetch(`http://localhost:3000/api/d1/printers/${printer_ID}`);

    if (!response11.ok) {
      throw new Error("Không thể lấy thông tin máy in");
    }

    const data11 = await response11.json();
    let newQueue = Number(data11.data.queue);
    newQueue++;
    console.log(newQueue);

    const response22 = await fetch(`http://localhost:3000/api/d1/printers/${printer_ID}/queue`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        queue: newQueue
      })
    });

    if (!response22.ok) {
      throw new Error("Không thể cập nhật queue");
    }
  }
  catch (error) {
    console.error(error);
    throw error;
  }

  //create PrintConfig
  try {
    const respone33 = await fetch("http://localhost:3000/api/d1/printconfigs", {
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
    if (!respone33.ok) console.log("Failing add new PrintConfig !");

    const data2 = await respone33.json();
    const cfID = await data2.data.config_ID;
    console.log(data2);
    console.log(cfID);
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
      body: JSON.stringify({
        "pageBalance": pgNum
      })
      ,
      headers: {
        "Content-Type": "application/json",
        "token": `Bearer ${token}`
      }
    });
    if (!respone.ok) {
      console.log("Failing substract pageBlance !");
      return false;
    }

    return true;


  } catch (error) {
    console.error(error);
    return false;
  }
}

function StringProcess(str) {
  /*the input format is `<pg_start>-<pg_end>`
    <pg_start> , <pg_end> : are the start page and end page need to print
  */
  const indexOfHyphen = str.indexOf('-');
  if (indexOfHyphen <= 0) return -1;

  const startpg = parseInt(str.split('-')[0]);
  const endpg = parseInt(str.split('-')[1]);
  const numberOfPage = endpg - startpg;

  if (numberOfPage < 0 || startpg <= 0) return -1;
  return { startpg, endpg };
}

async function getPdfPageCount(file) {
  if (file.type !== 'application/pdf') {
    return 'N/A'; // Not a PDF file
  }
  const fileReader = new FileReader();
  return new Promise((resolve) => {
    fileReader.onload = async function () {
      const typedArray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument(typedArray).promise;
      resolve(pdf.numPages);
    };
    fileReader.readAsArrayBuffer(file);
  });
}