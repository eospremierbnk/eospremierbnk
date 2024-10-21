'use strict';
//calculate shipping fee function
document.addEventListener('DOMContentLoaded', () => {
  const amountInput = document.getElementById('amountInput');
  const transferFee = document.getElementById('transferFee');
  const totalAmount = document.getElementById('totalAmount');
  const payAmount = document.getElementById('payAmount');

  const fixedTransferFee = parseFloat(transferFee.innerText);

  // Function to calculate and update total amount
  const updateTotal = () => {
    const amount = parseFloat(amountInput.value) || 0;
    const total = amount + fixedTransferFee;
    totalAmount.innerText = total.toFixed(2);
    payAmount.innerText = total.toFixed(2);
  };

  // Add event listener to amount input
  amountInput.addEventListener('input', updateTotal);
});

//redirect to internation transfer page
document.addEventListener('DOMContentLoaded', () => {
  const internationalTransferLabel = document.getElementById(
    'internationalTransferLabel'
  );
  const redirectUrl = '/user/internalTransfer';

  internationalTransferLabel.addEventListener('click', () => {
    // Optional: Show some feedback to the user
    internationalTransferLabel.innerHTML =
      'Processing... Redirecting in 5 seconds';

    // Start a timer for 5 seconds
    setTimeout(() => {
      // Redirect to the target page
      window.location.href = redirectUrl;
    }, 5000); // 5000 milliseconds = 5 seconds
  });
});

// Validation code script
const form = document.getElementById('authCodeForm');
const inputs = form.querySelectorAll('input');
const KEYBOARDS = {
  backspace: 8,
  arrowLeft: 37,
  arrowRight: 39,
};

function handleInput(e) {
  const input = e.target;
  const nextInput = input.nextElementSibling;
  if (nextInput && input.value) {
    nextInput.focus();
    if (nextInput.value) {
      nextInput.select();
    }
  }
}

function handlePaste(e) {
  e.preventDefault();
  const paste = e.clipboardData.getData('text');
  inputs.forEach((input, i) => {
    input.value = paste[i] || '';
  });
}

function handleBackspace(e) {
  const input = e.target;
  if (input.value) {
    input.value = '';
    return;
  }

  input.previousElementSibling.focus();
}

function handleArrowLeft(e) {
  const previousInput = e.target.previousElementSibling;
  if (!previousInput) return;
  previousInput.focus();
}

function handleArrowRight(e) {
  const nextInput = e.target.nextElementSibling;
  if (!nextInput) return;
  nextInput.focus();
}

form.addEventListener('input', handleInput);
inputs[0].addEventListener('paste', handlePaste);

inputs.forEach((input) => {
  input.addEventListener('focus', (e) => {
    setTimeout(() => {
      e.target.select();
    }, 0);
  });

  input.addEventListener('keydown', (e) => {
    switch (e.keyCode) {
      case KEYBOARDS.backspace:
        handleBackspace(e);
        break;
      case KEYBOARDS.arrowLeft:
        handleArrowLeft(e);
        break;
      case KEYBOARDS.arrowRight:
        handleArrowRight(e);
        break;
      default:
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  let timeLeft = 300;
  const countdownElement = document.getElementById('countdown');
  const targetUrl = '/user/localTransfer';

  function updateCountdown() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    countdownElement.innerText = `${minutes}:${seconds
      .toString()
      .padStart(2, '0')}`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      window.location.href = targetUrl;
    }

    timeLeft -= 1;
  }

  const timer = setInterval(updateCountdown, 1000);
  updateCountdown();
});
