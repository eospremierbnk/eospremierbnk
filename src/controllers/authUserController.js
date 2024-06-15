'use strict';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');
const { userSchema } = require('../validations');
const { tryCatch } = require('../middlewares');
const APIError = require('../errorHandlers/apiError');
const logger = require('../../logger/logger');
const config = require('../../src/configs/customEnvVariables');
const { sanitizeInput, sanitizeObject } = require('../utils');

//Login attempts Limit
const MAX_FAILED_ATTEMPTS = config.maxFailedAttempt;

// register controller
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
  const redirectUrl = `/auth/user/login`;
  res.status(201).json({
    redirectUrl,
    success: true,
    message: 'Registeration successful',
  });
});

// // User login
const userLogin = (req, res) => {
  const authErrorMessage = req.session.authErrorMessage;
  delete req.session.authErrorMessage;
  res.render('auth/user/login', { authErrorMessage });
};

const userLoginPost = tryCatch(async (req, res) => {
  const { username, password, pin } = sanitizeObject(req.body);
  const user = await User.findOne({ username });

  if (!user) {
    throw new APIError('Invalid username provided', 401);
  }

  // If the PIN is provided, verify it
  if (pin) {
    if (pin !== user.pin) {
      throw new APIError('Invalid PIN', 401);
    }
    // Successful PIN verification
    const userAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      config.jwtSecret,
      { expiresIn: config.userAccessTokenExpireTime }
    );
    const userRefreshToken = jwt.sign(
      { id: user._id, role: user.role },
      config.jwtSecret,
      { expiresIn: config.userRefreshTokenExpireTime }
    );

    req.session.userAccessToken = userAccessToken;
    req.session.userRefreshToken = userRefreshToken;

    res.cookie('userAccessToken', userAccessToken, {
      httpOnly: true,
      secure: true,
    });
    res.cookie('userRefreshToken', userRefreshToken, {
      httpOnly: true,
      secure: true,
    });

    return res.status(200).json({
      authRedirectUrl: '/user/index',
      success: true,
    });
  } else {
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new APIError('Invalid password provided', 401);
    }

    if (user.accountLocked || user.accountStatus === 'Locked') {
      throw new APIError(
        'Your account is suspended or locked. Please contact the administrator for assistance.',
        423
      );
    }

    // Reset failed login attempts
    await User.updateOne({ username }, { $set: { failedLoginAttempts: 0 } });

    // Convert user's image buffer to Base64
    let userImageUrl = 'https://bootdey.com/img/Content/avatar/avatar5.png';
    if (user.image && user.image.data) {
      const imageBuffer = user.image.data;
      const mimeType = user.image.contentType || 'image/jpeg';
      userImageUrl = `data:${mimeType};base64,${imageBuffer.toString(
        'base64'
      )}`;
    }

    // Respond with success, prompting PIN entry
    return res.status(200).json({
      success: true,
      userImageUrl,
    });
  }
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
  userLogin,
  userLoginPost,
  userRefreshToken,
};
