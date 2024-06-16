document.addEventListener('DOMContentLoaded', () => {
  const authCodeForm = document.getElementById('authCodeForm');
  const submitAuthCodeButton = document.getElementById('submitAuthCode');
  const thankYouMessage = document.getElementById('thankYouMessage');

  authCodeForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Change button text to "Verifying..."
    submitAuthCodeButton.innerText = 'Verifying...';
    submitAuthCodeButton.disabled = true;

    // Collect the OTP digits
    const otpInputs = authCodeForm.querySelectorAll('input[type="tel"]');
    let otp = '';
    otpInputs.forEach((input) => {
      otp += input.value;
    });

    try {
      const response = await fetch('/user/verifyingOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp }),
      });

      if (response.ok) {
        submitAuthCodeButton.innerText = 'Verified';

        const responseData = await response.json();
        const redirectUrl = responseData.redirectUrl;

        window.location.href = redirectUrl;
      } else {
        // Handle errors (e.g., invalid OTP)
        submitAuthCodeButton.innerText = 'Invalid TAC, Try Again';
        submitAuthCodeButton.disabled = false;
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      submitAuthCodeButton.innerText = 'Error, Try Again';
      submitAuthCodeButton.disabled = false;
    }
  });
});
