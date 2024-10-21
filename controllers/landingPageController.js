'use strict';
const { ContactUs } = require('../models');
const { contactUsSchema } = require('../validations');
const { tryCatch } = require('../middlewares');
const { contactQueriesMsg } = require('../mailers');
const { sanitizeObject } = require('../utils');

const indexPage = tryCatch((req, res) => {
  res.render('index');
});

const contactUsPost = tryCatch(async (req, res) => {
  const sanitizedBody = sanitizeObject(req.body);

  const { error, value } = contactUsSchema.validate(sanitizedBody, {
    abortEarly: false,
  });
  if (error) {
    const errors = error.details.map((err) => ({
      key: err.path[0],
      msg: err.message,
    }));
    return res.status(400).json({ success: false, errors });
  }

  const { firstName, lastName, email, subject, message } = value;
  const newContactUs = new ContactUs({
    firstName,
    lastName,
    email,
    subject,
    message,
    date_added: Date.now(),
  });
  await newContactUs.save();

  await contactQueriesMsg(newContactUs);
  res.status(201).json({ success: true, message: 'Message successfully sent' });
});

module.exports = {
  indexPage,
  contactUsPost,
};
