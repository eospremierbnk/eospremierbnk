'use strict';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');
const { tryCatch } = require('../middlewares');
const APIError = require('../errorHandlers/apiError');
const logger = require('../../logger/logger');
const config = require('../../src/configs/customEnvVariables');
const { adminRegistrationMsg } = require('../mailers');
const { sanitizeObject } = require('../utils');

const registerAdmin = tryCatch(async (req, res) => {
  res.render('index');
});

module.exports = { registerAdmin };
