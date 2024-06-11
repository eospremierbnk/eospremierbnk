document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.getElementById('contactForm');
  const thankYouMessage = document.getElementById('thankYouMessage');

  contactForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const submitButton = document.getElementById('sendMessageButton');
    submitButton.innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
    submitButton.disabled = true;

    try {
      const formData = Object.fromEntries(new FormData(contactForm));

      const response = await fetch('/contactPagePost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        contactForm.reset();
        contactForm.style.display = 'none';
        thankYouMessage.style.display = 'block';
      } else {
        // If registration failed, display error messages
        const errors = data.errors;
        errors.forEach((error) => {
          const errorElement = document.getElementById(`${error.key}Error`);
          if (errorElement) {
            errorElement.textContent = error.msg;
          }
        });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing your request.');
    } finally {
      submitButton.innerHTML = 'Send Message';
      submitButton.disabled = false;
    }
  });

  // Add event listener to each input field to clear error messages
  const inputFields = document.querySelectorAll('input, textarea');
  inputFields.forEach((inputField) => {
    inputField.addEventListener('input', () => {
      const fieldName = inputField.name;
      const errorElement = document.getElementById(`${fieldName}Error`);
      if (errorElement) {
        errorElement.innerText = '';
      }
    });
  });
});
