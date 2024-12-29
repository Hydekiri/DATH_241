const overlay = document.querySelector('.overlay');
const form = document.querySelector('.form');
const overlay2 = document.querySelector('.overlay-2');
const cancel = document.querySelector('.cancel');
const confirmButton = document.querySelector('.confirm-button');

// Đóng overlay khi nhấp ra ngoài
overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.add('hidden');
});

// Hiển thị xác nhận khi nhấn submit
form.addEventListener('submit', (event) => {
    event.preventDefault();
    overlay2.classList.remove('hidden');
});

// Đóng overlay xác nhận
cancel.addEventListener('click', () => {
    overlay2.classList.add('hidden');
});

// Xác nhận thêm máy in mới
confirmButton.addEventListener('click', async () => {
    const formValues = document.querySelectorAll('.form input, .form select');
    const printerData = {};

    // Collect input values
    formValues.forEach(input => {
        const key = input.id;
        let value = input.value.trim();

        // Convert numbers and handle empty values
        if (input.type === 'number') {
            value = value ? Number(value) : null;
        } else if (!value) {
            value = null;
        }

        printerData[key] = value;
    });

    // Format the `location` field
    if (printerData.location) {
        printerData.location = { building: printerData.location }; 
    } else {
        printerData.location = null;
    }

    // Required field validation
    const requiredFields = ['branchName', 'model', 'weight', 'location'];
    for (const field of requiredFields) {
        if (!printerData[field]) {
            alert(`Missing required field: ${field}. Please complete all required fields.`);
            return;
        }
    }

    console.log('Data to send:', printerData);

    // Send the data to the server
    try {
        const response = await fetch('http://localhost:3000/api/d1/printers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(printerData),
        });

        if (response.ok) {
            alert('Printer added successfully!');
            console.log('Sent data:', printerData);
            window.location.href= `admin-printer-home.html`;
        } else {
            const errorText = await response.text();
            alert(`Server Error: ${errorText}`);
        }
    } catch (error) {
        console.error('Connection Error:', error);
        alert('Failed to connect to the server.');
    }
});

