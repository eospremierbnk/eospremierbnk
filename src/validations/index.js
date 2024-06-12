const userSchema = require('./userValidation');
const adminSchema = require('./adminValidation');

const contactUsSchema = require('./contactUsValidation');
const beneficiarySchema = require('./beneficiaryValidation');

module.exports = {
  userSchema,
  adminSchema,
  contactUsSchema,
  beneficiarySchema,
};
