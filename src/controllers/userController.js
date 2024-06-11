'use strict';
const config = require('../configs/customEnvVariables');
const { tryCatch } = require('../middlewares');
const APIError = require('../errorHandlers/apiError');
const cloudinary = require('../configs/cloudinary');
const { ContactUs, Product } = require('../models');
const { newsLetterSchema } = require('../validations');
const {} = require('../mailers');
const { sanitizeInput, sanitizeObject } = require('../utils');

const userLandingPage = tryCatch(async (req, res) => {
  res.render('index');
});

module.exports = { userLandingPage };
