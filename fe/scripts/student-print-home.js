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


const confirm_button = document.querySelector('.confirm-button');

confirm_button.addEventListener('click', () => {

  const page_orientation = document.getElementById('orientation').value;
  const number_of_page = document.getElementById('page-num').value;
  const number_of_copy = document.getElementById('copies').value;
  const type_of_print = document.getElementById('print-type').value;
  const paper_type = document.getElementById('paper-size').value;

  //console.log(page_orientation + "-" + number_of_page + "-" + number_of_copy + "-" + type_of_print + "-" + paper_type);

  ///for each element in file_inf
  file_inf.forEach((doc) => {
    //console.log(doc.name + "----" + doc.size);
    createDocumentWith(doc.name, doc.size);
  })
});

function getCookie(name) {
  let value = `; ${document.cookie}`;
  let parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;  // If cookie not found
}

async function createDocumentWith(DocName, DocSize) {
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
        "config_ID": 1,
        "name": DocName,
        "size": DocSize,
        "lastModifiedDate": formattedDate
      }),
      headers : {
        "Content-Type": "application/json",  
        "token": `Bearer ${token}`   
      }
    });
    if(respone.ok) console.log("Successfully !");
    else console.log("Failing add new Document !");
  }
  catch (error) {
    console.error(error);
    alert("Failing create new Document !");
  }
}
