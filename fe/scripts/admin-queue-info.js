const overlay = document.querySelector('.overlay'),
cancel = document.querySelector('.cancel'),
confirm = document.querySelector('.confirm'),
deleteSucess = document.querySelector('.delete-success');

document.querySelectorAll('.delete-queue').forEach((button) => {
  button.addEventListener('click', () => {
    overlay.classList.remove('hidden');
  });
});

cancel.addEventListener('click', () => {
  overlay.classList.add('hidden');
});

confirm.addEventListener('click', () => {
  overlay.classList.add('hidden');

  deleteSucess.classList.remove('hidden');
  setTimeout(() => {
    deleteSucess.classList.add('hidden');
  }, 2000);
});