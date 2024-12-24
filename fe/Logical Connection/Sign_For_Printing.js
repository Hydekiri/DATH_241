document.addEventListener("DOMContentLoaded", () => {
    const confirm_button = document.querySelector('.confirm-button');

    confirm_button.addEventListener('click', () => {

        const page_orientation = document.getElementById('orientation').value;
        const number_of_page = document.getElementById('page-num').value;
        const number_of_copy = document.getElementById('copies').value;
        const type_of_print = document.getElementById('print-type').value;
        const paper_type = document.getElementById('paper-size').value;

        console.log(page_orientation + "-" + number_of_page + "-" + number_of_copy + "-" + type_of_print + "-" + paper_type);
    });
});