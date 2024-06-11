const Joi = require('joi');

const firstNameMessages = {
  'string.empty': 'Your Firstname is required',
  'any.required': 'Your Firstname is required',
};
const lastNameMessages = {
  'string.empty': 'Your Lastname is required',
  'any.required': 'Your Lastname is required',
};
const emailMessages = {
  'string.empty': 'Your email is required',
  'string.email': 'Contact email must be a valid email address',
  'any.required': 'Your email is required',
};
const subjectMessages = {
  'string.empty': 'Subject is required',
  'any.required': 'Subject brand name is required',
};
const msgMessages = {
  'string.empty': 'Message is required',
  'string.max': 'Message cannot exceed 250 characters',
  'any.required': 'Message is required',
};

// Define a Joi schema for the contact data
const contactUsSchema = Joi.object({
  firstName: Joi.string().required().messages(firstNameMessages),
  lastName: Joi.string().required().messages(lastNameMessages),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: {
        allow: ['com', 'net'],
      },
    })
    .required()
    .messages(emailMessages),
  subject: Joi.string().required().messages(subjectMessages),
  message: Joi.string().max(250).required().messages(msgMessages),
});

module.exports = contactUsSchema;
