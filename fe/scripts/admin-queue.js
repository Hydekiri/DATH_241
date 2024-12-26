const toggleCheckboxes = document.querySelectorAll('.toggle-checkbox');

toggleCheckboxes.forEach((checkbox) => {
  let toggleLabel = checkbox.nextElementSibling;
  let toggleCircle = toggleLabel.querySelector('.toggle-circle');

  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      toggleLabel.style.backgroundColor = '#DF1604';
      toggleLabel.style.boxShadow = 'inset 0 2px 5px rgba(0, 0, 0, 0.5)';
      toggleCircle.style.transform = 'translateX(40px)';
      toggleCircle.style.boxShadow = '-2px 2px 2px rgba(0, 0, 0, 0.2)';
    } else {
      toggleLabel.style.backgroundColor = '#1EDF04';
      toggleLabel.style.boxShadow = 'inset 0 2px 5px rgba(0, 0, 0, 0.5)';
      toggleCircle.style.transform = 'translateX(0)';
      toggleCircle.style.boxShadow = '2px 2px 2px rgba(0, 0, 0, 0.2)';
    }
  });
});
