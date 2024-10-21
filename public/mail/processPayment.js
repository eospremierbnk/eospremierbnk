'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const processingButton = document.getElementById('processingButton');
  const progressBar = document.getElementById('progressBar');
  const progressContainer = document.getElementById('progressContainer');
  const targetUrl = '/user/transactionProcessing';

  processingButton.addEventListener('click', async () => {
    try {
      // Send request to backend to generate OTP and send email
      const response = await fetch('/user/sendOTP', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Change button text and disable it
        processingButton.innerText = 'Processing...';
        processingButton.disabled = true;

        // Show progress bar
        progressContainer.style.display = 'block';

        // Simulate progress
        let progress = 10;
        const interval = setInterval(() => {
          if (progress >= 100) {
            clearInterval(interval);
            window.location.href = targetUrl;
          } else {
            progress += 10;
            progressBar.style.width = `${progress}%`;
            progressBar.setAttribute('aria-valuenow', progress);
            progressBar.innerText = `${progress}%`;
          }
        }, 500); // Adjust the interval timing as needed
      } else {
        console.error('Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  });
});
