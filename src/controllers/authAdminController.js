'use strict';
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');
const { adminSchema } = require('../validations');
const { tryCatch } = require('../middlewares');
const APIError = require('../errorHandlers/apiError');
const logger = require('../../logger/logger');
const config = require('../../src/configs/customEnvVariables');
const { sanitizeInput, sanitizeObject } = require('../utils');

// register controller
const registerAdmin = (req, res) => {
  res.render('auth/admin/register');
};

const registerAdminPost = tryCatch(async (req, res) => {
  const sanitizedBody = sanitizeObject(req.body);
  const { error, value } = adminSchema.validate(sanitizedBody, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((err) => ({
      key: err.path[0],
      msg: err.message,
    }));
    return res.status(400).json({ success: false, errors });
  }

  const admin = await Admin.findOne({
    $or: [{ email: value.email }, { username: value.username }],
  });

  if (admin) {
    if (admin.email === value.email) {
      throw new APIError('Email already registered', 409);
    }
    if (admin.username === value.username) {
      throw new APIError('Username already registered', 409);
    }
  }
  const { firstName, lastName, email, username, number, password } = value;

  const newAdmin = new Admin({
    firstName,
    lastName,
    email,
    username,
    number,
    password,
    date_added: Date.now(),
  });

  await newAdmin.save();
  const redirectUrl = `/auth/admin/login`;
  res
    .status(201)
    .json({ redirectUrl, success: true, message: 'Registeration successful' });
});

// login controller
const adminLogin = (req, res) => {
  const authErrorMessage = req.session.authErrorMessage;
  delete req.session.authErrorMessage;
  res.render('auth/admin/login', { authErrorMessage });
};

const adminLoginPost = tryCatch(async (req, res) => {
  const sanitizedBody = sanitizeObject(req.body);
  const { username, password } = sanitizedBody;

  // Find the user by their username
  const admin = await Admin.findOne({ username });
  if (!admin) {
    throw new APIError('Invalid username provided', 401);
  }

  if (admin.role !== 'Admin') {
    throw new APIError('Access forbidden. Only Admin are allowed.', 403);
  }

  if (password !== admin.password) {
    throw new APIError('Invalid password provided', 401);
  }

  const adminAccessToken = jwt.sign(
    { id: admin._id, role: admin.role },
    config.jwtSecret,
    { expiresIn: config.adminAccessTokenExpireTime }
  );
  const adminRefreshToken = jwt.sign(
    { id: admin._id, role: admin.role },
    config.jwtSecret,
    { expiresIn: config.adminRefreshTokenExpireTime }
  );

  req.session.adminAccessToken = adminAccessToken;
  req.session.adminRefreshToken = adminRefreshToken;

  // Set the tokens as cookies
  res.cookie('adminAccessToken', adminAccessToken, {
    httpOnly: true,
    secure: true,
  });
  res.cookie('adminRefreshToken', adminRefreshToken, {
    httpOnly: true,
    secure: true,
  });

  const authRedirectUrl = '/admin/index';

  logger.info('Admin login successful');
  res.status(200).json({
    authRedirectUrl,
    success: true,
    message: 'Admin login successful',
  });
});

// refreshToken controller
const adminRefreshToken = tryCatch((req, res) => {
  const adminRefreshToken = req.cookies.adminRefreshToken;
  if (!adminRefreshToken) {
    throw new APIError('Admin refresh token not provided', 401);
  }

  jwt.verify(
    adminRefreshToken,
    config.jwtSecret,
    (err, decodedAdminRefreshToken) => {
      if (err) {
        // Handle invalid refresh token
        throw new APIError('Invalid user refresh token', 403);
      } else {
        const newAdminAccessToken = jwt.sign(
          { id: decodedAdminRefreshToken.id },
          config.jwtSecret,
          { expiresIn: config.adminAccessTokenExpireTime }
        );

        // Log message indicating a new access token is generated
        logger.info(
          'New access token generated for admin:',
          newAdminAccessToken
        );

        res.cookie('adminAccessToken', newAdminAccessToken, {
          httpOnly: true,
          secure: true,
        });
        return res.status(200).json({ adminAccessToken: newAdminAccessToken });
      }
    }
  );
});

module.exports = {
  registerAdmin,
  registerAdminPost,
  adminLogin,
  adminLoginPost,
  adminRefreshToken,
};
