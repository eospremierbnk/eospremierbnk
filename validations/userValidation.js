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
const usernameMessages = {
  'string.empty': 'Username is required',
  'string.min': 'Username must be at least {#limit} characters',
  'any.required': 'Username is required',
};
const numberMessages = {
  'string.empty': 'Phone number is required',
  'string.pattern.base': 'Phone number must contain only digits',
  'string.min': 'Phone number must be at least {#limit} characters',
  'any.required': 'Phone number is required',
};
const passwordMessages = {
  'string.empty': 'Password is required',
  'string.min': 'Password must be at least {#limit} characters',
  'any.required': 'Password is required',
};
const addressMessages = {
  'string.empty': 'address is required',
  'string.min': 'address must be at least {#limit} characters',
  'any.required': 'address is required',
};
const cityMessages = {
  'string.empty': 'city is required',
  'string.min': 'city must be at least {#limit} characters',
  'any.required': 'city is required',
};
const stateMessages = {
  'string.empty': 'state is required',
  'string.min': 'state must be at least {#limit} characters',
  'any.required': 'state is required',
};
const savingsAccountNumberMessages = {
  'string.empty': 'savings account number is required',
  'string.min': 'avings account number must be at least {#limit} characters',
  'any.required': 'avings account number is required',
};
const checkingAccountNumberMessages = {
  'string.empty': 'checking account number is required',
  'string.min': 'checking account number must be at least {#limit} characters',
  'any.required': 'checking account number is required',
};
const savingAccountBalanceMessages = {
  'string.empty': 'saving account balance is required',
  'string.min': 'saving account balance must be at least {#limit} characters',
  'any.required': 'saving account balance is required',
};
const checkingAccountBalanceMessages = {
  'string.empty': 'checking account balance is required',
  'string.min': 'checking account balance must be at least {#limit} characters',
  'any.required': 'checking account balance is required',
};
const pinMessages = {
  'string.empty': 'Pin is required',
  'string.min': 'Pin must be at least {#limit} characters',
  'any.required': 'Pin is required',
};
// Define a Joi schema for the user data
const userSchema = Joi.object({
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
  username: Joi.string().min(5).required().messages(usernameMessages),
  number: Joi.string()
    .pattern(/^\d+$/)
    .min(5)
    .required()
    .messages(numberMessages),
  password: Joi.string().min(6).required().messages(passwordMessages),
  address: Joi.string().min(2).required().messages(addressMessages),
  city: Joi.string().min(2).required().messages(cityMessages),
  state: Joi.string().min(2).required().messages(stateMessages),
  savingsAccountNumber: Joi.string()
    .min(2)
    .required()
    .messages(savingsAccountNumberMessages),
  checkingAccountNumber: Joi.string()
    .min(2)
    .required()
    .messages(checkingAccountNumberMessages),
  savingAccountBalance: Joi.string()
    .min(2)
    .required()
    .messages(savingAccountBalanceMessages),
  checkingAccountBalance: Joi.string()
    .min(2)
    .required()
    .messages(checkingAccountBalanceMessages),
  pin: Joi.string().min(4).required().messages(pinMessages),
});

module.exports = userSchema;
