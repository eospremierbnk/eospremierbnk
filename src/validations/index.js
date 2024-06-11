const userSchema = require('./userValidation');
const adminSchema = require('./adminValidation');

const newsLetterSchema = require('./newsLetterValidation');
const contactUsSchema = require('./contactUsValidation');

module.exports = { userSchema, adminSchema, newsLetterSchema, contactUsSchema };
