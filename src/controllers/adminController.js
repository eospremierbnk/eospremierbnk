'use strict';
const cloudinary = require('../configs/cloudinary');
const { tryCatch } = require('../middlewares');
const APIError = require('../errorHandlers/apiError');
const { updateAdminProfileMsg } = require('../mailers');
const { Blacklist, User, Admin } = require('../models');
const { sanitizeInput, sanitizeObject } = require('../utils');

const adminIndexPage = tryCatch(async (req, res) => {
  res.render('index');
});

module.exports = { adminIndexPage };
