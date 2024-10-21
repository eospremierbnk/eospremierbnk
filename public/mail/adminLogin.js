'use strict';
// Refresh token function
async function refreshToken() {
  try {
    const response = await fetch('/auth/adminRefreshToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Ensure cookies are sent with the request
    });

    if (response.ok) {
      const data = await response.json();
      // Update your access token in your application state
      sessionStorage.setItem('adminAccessToken', data.adminAccessToken);
    } else {
      console.error('Failed to refresh token');
      const errorMessageElement = document.getElementById('message');
      if (response.status === 401 || response.status === 403) {
        errorMessageElement.innerText =
          'Unauthorized access. Please log in again.';
        window.location.href = '/auth/admin/login';
      } else {
        errorMessageElement.innerText =
          'Failed to refresh token. Please try again later.';
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example function to call refreshToken periodically 3hrs
function setupTokenRefreshInterval() {
  const refreshInterval = 3 * 60 * 60 * 1000;
  setInterval(refreshToken, refreshInterval);
}

document.addEventListener('DOMContentLoaded', () => {
  setupTokenRefreshInterval();

  const successMessageContainer = document.getElementById(
    'successMessageContainer'
  );

  const loginForm = document.getElementById('loginForm');
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const username = formData.get('username');
    const password = formData.get('password');
    // Fetch URL from form attribute
    const loginUrl = loginForm.getAttribute('data-url');

    // Change the appearance of the submit button to show a spinner
    const submitButton = document.getElementById('submitButton');
    submitButton.innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging...';
    submitButton.disabled = true;

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const responseData = await response.json();
      if (response.ok && responseData.success) {
        window.location.href = responseData.authRedirectUrl;
      } else {
        displayErrorMessage(
          responseData.message || 'Login failed. Please try again.'
        );
      }
    } catch (error) {
      console.error('An error occurred. Please try again later.');
      displayErrorMessage('An error occurred. Please try again later.');
    } finally {
      submitButton.innerHTML = 'Login';
      submitButton.disabled = false;
    }
  });

  function displayErrorMessage(message) {
    successMessageContainer.innerHTML = '';
    const errorMessageElement = document.createElement('div');
    errorMessageElement.className = 'error-message';
    errorMessageElement.textContent = message;
    successMessageContainer.appendChild(errorMessageElement);
  }

  // Display success message from URL parameter if exists
  const urlParams = new URLSearchParams(window.location.search);
  const successMessage = urlParams.get('successMessage');
  if (successMessage) {
    successMessageContainer.textContent = decodeURIComponent(successMessage);
    setTimeout(clearSuccessMessage, 5000);
  }
});

function clearSuccessMessage() {
  const successMessageContainer = document.getElementById(
    'successMessageContainer'
  );
  successMessageContainer.innerHTML = '';
}
