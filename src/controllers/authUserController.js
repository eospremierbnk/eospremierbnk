'use strict';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const randomstring = require('randomstring');
const { User } = require('../models');
const { userSchema } = require('../validations');
const { tryCatch } = require('../middlewares');
const APIError = require('../errorHandlers/apiError');
const logger = require('../logger/logger');
const config = require('../configs/customEnvVariables');
const { sanitizeInput, sanitizeObject } = require('../utils');
const {} = require('../mailers');

//Login attempts Limit
const MAX_FAILED_ATTEMPTS = config.maxFailedAttempt;

const registerUser = tryCatch(async (req, res) => {
  res.render('index');
});

module.exports = { registerUser };
