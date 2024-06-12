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
const ConfirmPasswordMessages = {
  'any.only': 'Passwords must match',
  'string.empty': 'Confirm password is required',
  'any.required': 'Password is required',
};

// Define a Joi schema for the user data
const adminSchema = Joi.object({
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
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages(ConfirmPasswordMessages),
});

module.exports = adminSchema;
