const { paginatedResults, userBeneficiaryFilter } = require('./pagination');

const {
  sanitizeInput,
  sanitizeObject,
  generateOTP,
  generateLastOTP,
} = require('./inputSanitizer');

module.exports = {
  paginatedResults,
  userBeneficiaryFilter,

  sanitizeInput,
  sanitizeObject,
  generateOTP,
  generateLastOTP,
};
