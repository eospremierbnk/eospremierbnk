const Joi = require('joi');
const emailMessages = {
  'string.empty': 'Email is required',
  'string.email': 'Invalid email format. Please provide a valid email address.',
  'any.required': 'Email is required',
};

// Define a Joi schema for the newsLetter data
const newsLetterSchema = Joi.object({
  subscriberEmail: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: {
        allow: ['com', 'net'],
      },
    })
    .required()
    .messages(emailMessages),
});

module.exports = newsLetterSchema;
