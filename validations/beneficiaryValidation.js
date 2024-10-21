const Joi = require('joi');

const firstNameMessages = {
  'string.empty': 'Firstname is required',
  'string.min': 'Firstname must be at least {#limit} characters',
  'any.required': 'Firstname is required',
};
const lastNameMessages = {
  'string.empty': 'Lastname is required',
  'string.min': 'Lastname must be at least {#limit} characters',
  'any.required': 'Lastname is required',
};
const emailMessages = {
  'string.empty': 'Email is required',
  'string.email': 'Invalid email format. Please provide a valid email address.',
  'any.required': 'Email is required',
};
const numberMessages = {
  'number.base': 'Number must be a number',
  'number.integer': 'Number must be an integer',
  'number.min': 'Number is required',
  'any.required': 'Number is required',
};
const addressMessages = {
  'string.empty': 'Address is required',
  'any.required': 'Address is required',
};
const cityMessages = {
  'string.empty': 'City is required',
  'any.required': 'City is required',
};
const stateMessages = {
  'string.empty': 'State is required',
  'any.required': 'State is required',
};
const zipcodeMessages = {
  'number.base': 'Zipcode must be a number',
  'number.integer': 'Zipcode must be an integer',
  'number.min': 'Zipcode is required',
  'any.required': 'Zipcode is required',
};
const checkingAccountNumberMessages = {
  'number.base': 'Account Number must be a number',
  'number.integer': 'Account Number must be an integer',
  'number.min': 'Account Number is required',
  'any.required': 'Account Number is required',
};
const accountTypeMessages = {
  'string.empty': 'Account type is required',
  'any.required': 'Account type is required',
};
const relationshipMessages = {
  'string.empty': 'Relationship is required',
  'any.required': 'Relationship is required',
};

// Define a Joi schema for the user data
const beneficiarySchema = Joi.object({
  firstName: Joi.string().min(2).required().messages(firstNameMessages),
  lastName: Joi.string().min(2).required().messages(lastNameMessages),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: {
        allow: ['com', 'net'],
      },
    })
    .required()
    .messages(emailMessages),
  number: Joi.number().integer().min(1).required().messages(numberMessages),
  checkingAccountNumber: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages(checkingAccountNumberMessages),
  address: Joi.string().required().messages(addressMessages),
  city: Joi.string().required().messages(cityMessages),
  state: Joi.string().required().messages(stateMessages),
  zipcode: Joi.number().integer().min(1).required().messages(zipcodeMessages),
  accountType: Joi.string().required().messages(accountTypeMessages),
  relationship: Joi.string().required().messages(relationshipMessages),
});

module.exports = beneficiarySchema;
