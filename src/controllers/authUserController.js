'use strict';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const randomstring = require('randomstring');
const { User } = require('../models');
const { userSchema } = require('../validations');
const { tryCatch } = require('../middlewares');
const APIError = require('../errorHandlers/apiError');
const logger = require('../../logger/logger');
const config = require('../../src/configs/customEnvVariables');
const { sanitizeInput, sanitizeObject } = require('../utils');
const {} = require('../mailers');

//Login attempts Limit
const MAX_FAILED_ATTEMPTS = config.maxFailedAttempt;

const registerUser = tryCatch(async (req, res) => {
  res.render('auth/user/register');
});

const checkExistingUser = tryCatch(async (req, res) => {
  const { field, value } = req.query;
  let user;

  if (field === 'email' || field === 'username') {
    const sanitizedField = sanitizeInput(field);
    const sanitizedValue = sanitizeInput(value);
    user = await User.findOne({ [sanitizedField]: sanitizedValue });
  } else {
    throw new APIError('Invalid field parameter', 400);
  }

  if (user) {
    res.status(200).json({
      exists: true,
      message: `${field} has already been registered, please log in.`,
    });
  } else {
    // If user doesn't exist, send a JSON response with exists: false
    res.json({ exists: false });
  }
});

const registerUserPost = tryCatch(async (req, res) => {
  const sanitizedBody = sanitizeObject(req.body);
  const { error, value } = userSchema.validate(sanitizedBody, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((err) => ({
      key: err.path[0],
      msg: err.message,
    }));
    return res.status(400).json({ success: false, errors });
  }

  const user = await User.findOne({
    $or: [{ email: value.email }, { username: value.username }],
  });

  if (user) {
    if (user.email === value.email) {
      throw new APIError('Email already registered', 409);
    }
    if (user.username === value.username) {
      throw new APIError('Username already registered', 409);
    }
  }

  const { firstName, lastName, email, username, number, password } = value;

  const hashedPassword = await bcrypt.hash(password, 10);

  // Save the user data to the database
  const newUser = new User({
    firstName,
    lastName,
    email,
    username,
    number,
    password: hashedPassword,
    date_added: Date.now(),
  });

  await newUser.save();

  res.status(201).json({
    success: true,
    message: 'Registeration successful',
  });
});

// User login
const loginPage = (req, res) => {
  const authErrorMessage = req.session.authErrorMessage;
  delete req.session.authErrorMessage;
  res.render('auth/user/login', { authErrorMessage });
};

const userLoginPost = tryCatch(async (req, res) => {
  const sanitizedBody = sanitizeObject(req.body);
  const { username, password } = sanitizedBody;

  const user = await User.findOne({ username });

  if (!user) {
    throw new APIError('Invalid username provided', 401);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    // If passwords do not match, increment failed login attempts
    await User.updateOne({ username }, { $inc: { failedLoginAttempts: 1 } });

    // Check if the account should be locked
    const updatedUser = await User.findOne({ username });
    if (updatedUser.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
      await User.updateOne({ username }, { $set: { accountLocked: true } });
      throw new APIError(
        'Account locked. Contact EOS premier bank for assistance to reset Password',
        403
      );
    } else {
      throw new APIError(
        'Invalid Password 2 attempts left before access disabled',
        409
      );
    }
  }

  if (
    user.accountLocked ||
    user.accountStatus === 'Suspend' ||
    user.accountStatus === 'Locked'
  ) {
    throw new APIError(
      'Your account is suspended or locked. Please contact the administrator for assistance.',
      423
    );
  }

  // Successful login - reset failed login attempts
  await User.updateOne({ username }, { $set: { failedLoginAttempts: 0 } });

  // Generate an access token and a refresh token
  const userAccessToken = jwt.sign(
    { id: user._id, userRole: user.userRole },
    config.jwtSecret,
    { expiresIn: config.userAccessTokenExpireTime }
  );
  const userRefreshToken = jwt.sign(
    { id: user._id, userRole: user.userRole },
    config.jwtSecret,
    { expiresIn: config.userRefreshTokenExpireTime }
  );

  req.session.userAccessToken = userAccessToken;
  req.session.userRefreshToken = userRefreshToken;

  // Set the tokens as cookies
  res.cookie('userAccessToken', userAccessToken, {
    httpOnly: true,
    secure: true,
  });
  res.cookie('userRefreshToken', userRefreshToken, {
    httpOnly: true,
    secure: true,
  });

  const redirectUrl = '/user/index';

  res.status(200).json({
    redirectUrl,
    success: true,
    message: 'User login successful',
  });
});

// refreshToken controller
const userRefreshToken = tryCatch((req, res) => {
  const userRefreshToken = req.cookies.userRefreshToken;

  if (!userRefreshToken) {
    return res.status(401).json({ message: 'User refresh token not provided' });
  }

  jwt.verify(
    userRefreshToken,
    config.jwtSecret,
    (err, decodedUserRefreshToken) => {
      if (err) {
        // Handle invalid refresh token
        throw new APIError('Invalid user refresh token', 403);
      } else {
        const newUserAccessToken = jwt.sign(
          { id: decodedUserRefreshToken.id },
          config.jwtSecret,
          { expiresIn: config.userAccessTokenExpireTime }
        );

        // Log message indicating a new access token is generated
        logger.info('New access token generated for user:', newUserAccessToken);

        res.cookie('userAccessToken', newUserAccessToken, {
          httpOnly: true,
          secure: true,
        });
        return res.status(200).json({ userAccessToken: newUserAccessToken });
      }
    }
  );
});

module.exports = {
  registerUser,
  checkExistingUser,
  registerUserPost,
  loginPage,
  userLoginPost,
  userRefreshToken,
};
