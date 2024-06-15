'use strict';
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { tryCatch } = require('../middlewares');
const APIError = require('../errorHandlers/apiError');
const logger = require('../../logger/logger');
const config = require('../../src/configs/customEnvVariables');
const { sanitizeInput, sanitizeObject } = require('../utils');
const { sendLoginNotification } = require('../mailers');

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
    if (password !== user.password) {
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

    // Send login notification
    await sendLoginNotification(user);

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
  userLogin,
  userLoginPost,
  userRefreshToken,
};
