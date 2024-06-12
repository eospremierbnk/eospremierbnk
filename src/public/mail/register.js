'use strict';

// Function to check if email or username already exists asynchronously
async function checkExistingUser(field, value) {
  try {
    const response = await fetch(
      `/checkExistingUser?field=${field}&value=${encodeURIComponent(value)}`
    );
    const data = await response.json();
    return data; // Return the response data directly
  } catch (error) {
    console.error('Error checking existing user:', error);
    return {
      exists: false,
      message: 'An error occurred while checking existing user',
    };
  }
}

// Add event listeners to email and username input fields
const emailField = document.querySelector('input[name="email"]');
const usernameField = document.querySelector('input[name="username"]');
const emailErrorElement = document.getElementById('emailError');
const usernameErrorElement = document.getElementById('usernameError');

emailField.addEventListener('input', async () => {
  const email = emailField.value.trim();
  if (email) {
    const { exists, message } = await checkExistingUser('email', email);
    if (exists) {
      emailErrorElement.textContent = message;
      console.log(emailErrorElement.textContent);
    } else {
      emailErrorElement.textContent = '';
    }
  }
});

usernameField.addEventListener('input', async () => {
  const username = usernameField.value.trim();
  if (username) {
    const { exists, message } = await checkExistingUser('username', username);
    if (exists) {
      usernameErrorElement.textContent = message;
      console.log(usernameErrorElement.textContent);
    } else {
      usernameErrorElement.textContent = '';
    }
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const registrationForm = document.getElementById('registrationForm');
  registrationForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    // Change the appearance of the submit button to show a spinner
    const submitButton = document.getElementById('submitButton');
    submitButton.innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
    submitButton.disabled = true;

    try {
      const formData = Object.fromEntries(new FormData(registrationForm));
      const response = await fetch('/auth/user/registerUserPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = `/auth/user/login`;
      } else {
        const errors = data.errors;
        errors.forEach((error) => {
          const errorElement = document.getElementById(`${error.key}Error`);
          if (errorElement) {
            errorElement.textContent = error.msg;
          }
        });

        // Check if email or username is already registered
        const emailAlreadyRegistered = errors.some(
          (error) => error.msg === 'Email already registered'
        );
        const usernameAlreadyRegistered = errors.some(
          (error) => error.msg === 'Username already registered'
        );
        if (emailAlreadyRegistered) {
          const emailErrorElement = document.getElementById('userEmailError');
          if (emailErrorElement) {
            emailErrorElement.innerText = 'Email already registered';
          }
        } else if (usernameAlreadyRegistered) {
          const usernameErrorElement =
            document.getElementById('userUsernameError');
          if (usernameErrorElement) {
            usernameErrorElement.innerText = 'Username already registered';
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing your request.');
    } finally {
      submitButton.innerHTML = 'Submit';
      submitButton.disabled = false; // Re-enable the button
    }
  });

  // Add event listener to each input field to clear error messages
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
