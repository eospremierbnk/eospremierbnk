'use strict';
const cloudinary = require('../configs/cloudinary');
const { tryCatch } = require('../middlewares');
const APIError = require('../errorHandlers/apiError');
const { updateAdminProfileMsg } = require('../mailers');
const { sanitizeObject } = require('../utils');
const { Blacklist, User, Admin } = require('../models');

const adminIndexPage = tryCatch(async (req, res) => {
  res.render('index');
});

module.exports = { adminIndexPage };
