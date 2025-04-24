document.getElementById('contributorForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const bio = document.getElementById('bio').value;
    const website = document.getElementById('website').value;
    const email = document.getElementById('email').value;

    // Create request body
    const contributorData = {
        name,
        bio,
        website,
        email,
        status: 'pending' // Initial status
    };

    try {
        const response = await fetch('/api/contributors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contributorData)
        });

        const result = await response.json();

        if (response.ok) {
            // Show success message
            const alertEl = document.getElementById('formAlert');
            alertEl.className = 'alert alert-success mt-3';
            alertEl.textContent = 'Your profile has been submitted and is pending review!';
            alertEl.style.display = 'block';

            // Reset form
            document.getElementById('contributorForm').reset();
        } else {
            // Show error message
            const alertEl = document.getElementById('formAlert');
            alertEl.className = 'alert alert-danger mt-3';
            alertEl.textContent = result.message || 'There was an error submitting your profile';
            alertEl.style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        const alertEl = document.getElementById('formAlert');
        alertEl.className = 'alert alert-danger mt-3';
        alertEl.textContent = 'Network error occurred. Please try again later.';
        alertEl.style.display = 'block';
    }
});