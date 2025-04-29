const registrationSubmitClickHandler = () => {
    // Form Validation
    let isValid = true;
    const formElements = document.querySelectorAll('#registration-form input, #registration-form textarea, #registration-form select');
    let formData = {};

    formElements.forEach(element => {
        // Collect form data
        if (element.type === 'checkbox') {
            formData[element.name] = element.checked;
        } else if (element.type === 'radio') {
            if (element.checked) {
                formData[element.name] = element.value;
            }
        } else if (element.value.trim() !== "") {
            formData[element.name] = element.value;
        } else {
            // Check if required field is empty
            if (element.hasAttribute('required')) {
                isValid = false;
                element.classList.add('is-invalid');
            }
        }
    });

    // If the form is not valid, alert and return
    if (!isValid) {
        alert('Please fill out all required fields.');
        return;
    }

    // Populate modal with the collected form data
    const confirmMessageBody = document.getElementById('confirmMessageBody');
    confirmMessageBody.innerHTML = `<pre>${JSON.stringify(formData, null, 2)}</pre>`;

    // Show the modal
    $('#submitFormConfirm').modal('show');
}

// When clicking on submit in the confirmation modal, send data to the backend
document.getElementById('submitForm').addEventListener('click', async () => {
    const formData = document.getElementById('confirmMessageBody').textContent; // Get the content from modal
    const parsedFormData = JSON.parse(formData); // Convert the string back to an object

    // Send a POST request to the /register endpoint
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parsedFormData), // Send the parsed form data
        });

        const result = await response.json();
        if (response.ok) {
            console.log('Form submitted successfully:', result);
            alert('Registration successful!');
        } else {
            console.error('Error submitting form:', result);
            alert('There was an error submitting your registration.');
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('An error occurred while submitting your registration.');
    }

    // Hide the modal after submission
    $('#submitFormConfirm').modal('hide');
});

// Clear the invalid feedback when user starts typing in the fields
document.querySelectorAll('#registration-form input, #registration-form textarea').forEach(input =>
    input.addEventListener('input', () => {
        input.classList.remove('is-invalid');
    })
);
