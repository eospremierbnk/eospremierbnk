'use strict';
const { ContactUs, Product, NewsLetter } = require('../models');
const { newsLetterSchema, contactUsSchema } = require('../validations');
const { tryCatch } = require('../middlewares');
const APIError = require('../errorHandlers/apiError');
const { contactQueriesMsg, newNewsLetterMsg } = require('../mailers');
const { sanitizeInput, sanitizeObject } = require('../utils');

const indexPage = tryCatch(async (req, res) => {
  res.render('index');
});

module.exports = {
  indexPage,
};
