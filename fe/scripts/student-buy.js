const minusButton = document.querySelector('.minus'),
plusButton = document.querySelector('.plus'),
numPageInput = document.getElementById('numpage');

minusButton.addEventListener('click', function() {
  let currentValue = parseInt(numPageInput.value);
  if (currentValue > 0) { 
    numPageInput.value = currentValue - 1;
  }
});

plusButton.addEventListener('click', function() {
  let currentValue = parseInt(numPageInput.value);
  numPageInput.value = currentValue + 1;
});


const payButton = document.querySelector('.button-pay'),
overlay = document.querySelector('.overlay'),
returnButton = document.querySelector('.return');

payButton.addEventListener('click', () => {
  overlay.classList.remove('hidden');
});

returnButton.addEventListener('click', () => {
  overlay.classList.add('hidden');
})