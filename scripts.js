// This script handles the form submission and displays a simple message

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Show an alert with the form values
    alert(`Thank you, ${name}! Your message has been received. We will contact you at ${email}.`);

    // Optionally, you can reset the form after submission
    event.target.reset();
});
