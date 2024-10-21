const validator = require('validator');

// Helper function to trim and sanitize input
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    input = validator.trim(input);
    input = validator.escape(input);
  }
  return input;
};

const sanitizeObject = (obj) => {
  const sanitizedObj = {};
  Object.keys(obj).forEach((key) => {
    sanitizedObj[key] = sanitizeInput(obj[key]);
  });
  return sanitizedObj;
};

function generateOTP() {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

function generateLastOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = { sanitizeInput, sanitizeObject, generateOTP,generateLastOTP };
