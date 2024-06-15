const { paginatedResults, userBeneficiaryFilter } = require('./pagination');

const {
  sanitizeInput,
  sanitizeObject,
  generateOTP,
} = require('./inputSanitizer');

module.exports = {
  paginatedResults,
  userBeneficiaryFilter,

  sanitizeInput,
  sanitizeObject,
  generateOTP,
};
