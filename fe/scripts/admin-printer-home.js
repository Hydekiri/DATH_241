const addPrinter = document.querySelector('.add');
const overlay = document.querySelector('.overlay');
const form = document.querySelector('.form');
const overlay2 = document.querySelector('.overlay-2');
const cancel = document.querySelector('.cancel');
const confirmButton = document.querySelector('.confirm-button');

addPrinter.addEventListener('click', () => {
  overlay.classList.remove('hidden');
});

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) {
    overlay.classList.add('hidden');
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  overlay2.classList.remove('hidden');
});

confirmButton.addEventListener('click', () => {
  form.submit();
});

cancel.addEventListener('click', () => {
  overlay2.classList.add('hidden');
});