'use strict';
const { tryCatch } = require('../middlewares');
const APIError = require('../errorHandlers/apiError');
const { updateAdminProfileMsg } = require('../mailers');
const { Blacklist, User, Admin } = require('../models');
const { sanitizeInput, sanitizeObject } = require('../utils');

const adminIndexPage = tryCatch((req, res) => {
  const admin = req.currentAdmin;
  res.render('admin/index', { admin });
});

module.exports = { adminIndexPage };
