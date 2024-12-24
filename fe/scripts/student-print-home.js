const form = document.querySelector("form"),
fileInput = document.querySelector(".file-input"),
uploadedArea = document.querySelector(".uploaded-area");

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
                        <img class="file-delete-button" src="images/icons/delete.png"></img>
                      </li>`;
  uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
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
