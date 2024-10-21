'use strict';
// Refresh token function
async function refreshToken() {
  try {
    const response = await fetch('/auth/userRefreshToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Ensure cookies are sent with the request
    });

    if (response.ok) {
      const data = await response.json();
      // Update your access token in your application state
      sessionStorage.setItem('userAccessToken', data.userAccessToken);
    } else {
      console.error('Failed to refresh token');
      const errorMessageElement = document.getElementById(
        'successMessageContainer'
      );
      if (response.status === 401 || response.status === 403) {
        errorMessageElement.innerText =
          'Unauthorized access. Please log in again.';
        window.location.href = '/auth/user/login';
      } else {
        errorMessageElement.innerText =
          'Failed to refresh token. Please try again later.';
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example function to call refreshToken periodically
function setupTokenRefreshInterval() {
  const refreshInterval = 3 * 60 * 60 * 1000;
  setInterval(refreshToken, refreshInterval);
}

document.addEventListener('DOMContentLoaded', () => {
  setupTokenRefreshInterval();
  const loginForm = document.getElementById('loginForm');
  const submitButton = document.getElementById('submitButton');
  const credentialsSection = document.getElementById('credentialsSection');
  const pinSection = document.getElementById('pinSection');
  const successMessageContainer = document.getElementById(
    'successMessageContainer'
  );

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    submitButton.innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Verifying...';

    const formData = new FormData(event.target);
    const username = formData.get('username');
    const password = formData.get('password');
    const imageContainer = document.getElementById('imageContainer');
    const pin = formData.get('pin');
    const loginUrl = loginForm.getAttribute('data-url');

    try {
      if (pin) {
        // Handle PIN verification
        const response = await fetch(loginUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, pin }),
        });
        const responseData = await response.json();
        if (response.ok && responseData.success) {
          window.location.href = responseData.authRedirectUrl;
        } else {
          displayErrorMessage(
            responseData.message || 'Invalid PIN. Please try again.'
          );
        }
      } else {
        // Handle username and password verification
        const response = await fetch(loginUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        const responseData = await response.json();
        if (response.ok && responseData.success) {
          credentialsSection.style.display = 'none';

          pinSection.style.display = 'block';

          if (responseData.userImageUrl) {
            imageContainer.style.backgroundImage = `url('${responseData.userImageUrl}')`;
          }

          // Update button text
          submitButton.innerHTML = 'Verify PIN';
        } else {
          displayErrorMessage(
            responseData.message || 'Login failed. Please try again.'
          );
        }
      }
    } catch (error) {
      console.error('An error occurred. Please try again later.');
      displayErrorMessage('An error occurred. Please try again later.');
    } finally {
      submitButton.disabled = false;
      if (!pin) submitButton.innerHTML = 'Sign In';
    }
  });

  function displayErrorMessage(message) {
    successMessageContainer.innerHTML = '';
    const errorMessageElement = document.createElement('div');
    errorMessageElement.className = 'error-message';
    errorMessageElement.textContent = message;
    successMessageContainer.appendChild(errorMessageElement);
  }
});
