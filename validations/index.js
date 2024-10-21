const userSchema = require('./userValidation');
const adminSchema = require('./adminValidation');

const {
  contactUsSchema,
  contactAdminSchema,
} = require('./contactUsValidation');
const beneficiarySchema = require('./beneficiaryValidation');

module.exports = {
  userSchema,
  adminSchema,
  contactUsSchema,
  contactAdminSchema,
  beneficiarySchema,
};
