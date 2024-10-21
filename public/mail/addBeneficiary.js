document.addEventListener('DOMContentLoaded', function () {
  const addBeneficiary = document.getElementById('addNewBeneficiary');

  addBeneficiary.addEventListener('submit', async function (event) {
    event.preventDefault();

    const addData = addBeneficiary.getAttribute('data-url');
    const submitButton = document.getElementById('submit_btn');
    submitButton.innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
    submitButton.disabled = true;

    try {
      const formData = Object.fromEntries(
        new FormData(addBeneficiary).entries()
      );

      console.log('Form data:', formData);

      const response = await fetch(addData, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.errors) {
          data.errors.forEach((error) => {
            const errorElement = document.getElementById(`${error.key}Error`);
            if (errorElement) {
              errorElement.textContent = error.msg;
            }
          });
        }
        throw new Error('Validation errors occurred.');
      } else {
        const data = await response.json();
        if (data.success) {
          alert(data.message);
          addBeneficiary.reset();
          window.location.href = data.redirectUrl;
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing your request.');
    } finally {
      submitButton.innerHTML = 'Save Changes';
      submitButton.disabled = false;
    }
  });

  const inputFields = document.querySelectorAll('input, select');
  inputFields.forEach((inputField) => {
    inputField.addEventListener('input', () => {
      const fieldName = inputField.name;
      const errorElement = document.getElementById(fieldName + 'Error');
      if (errorElement) {
        errorElement.innerText = '';
      }
    });
  });
});
