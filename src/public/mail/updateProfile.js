'use strict';

document
  .getElementById('EditProfileForm')
  .addEventListener('submit', async function (event) {
    event.preventDefault();

    // Fetch URL from form attribute
    const updateProfile = this.getAttribute('data-url');

    const formData = new FormData(this);
    const formObject = Object.fromEntries(formData.entries());

    const submitButton = document.getElementById('submit_btn');
    submitButton.innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> updating profile...';

    try {
      const response = await fetch(updateProfile, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formObject),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      submitButton.innerHTML = 'Update Profile';
    }
  });
