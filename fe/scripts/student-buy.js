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
