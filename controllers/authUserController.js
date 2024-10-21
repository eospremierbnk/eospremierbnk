'use strict';
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');
const { tryCatch } = require('../middlewares');
const APIError = require('../errorHandlers/apiError');
const logger = require('../logger/logger');
const config = require('../configs/customEnvVariables');
const { sanitizeInput, sanitizeObject } = require('../utils');
const {
  sendLoginNotification,
  forgetPasswordMsg,
  resetPasswordMsg,
} = require('../mailers');

// Forget Password
const forgetPassword = (req, res) => {
  const errorMessage = req.query.errorMessage;
  res.render('auth/user/forgetPassword', { errorMessage });
};

const forgetPasswordPost = tryCatch(async (req, res) => {
  const email = sanitizeInput(req.body.email);

  const user = await User.findOne({ email });
  if (!user) {
    throw new APIError('Email not found', 404);
  }

  const resetToken = user.getResetPasswordToken();
  await user.save();

  // Send the email with the reset link
  const resetLink = `${
    config.baseUrl || 'http://localhost:3000'
  }/auth/user/resetPassword/${resetToken}`;

  // Send forget Email content to user
  await forgetPasswordMsg(user, resetLink);

  return res.status(200).json({
    success: true,
    message: 'Reset link sent to your mail successfully',
  });
});

//  RESET PASSWORD SECTION
const resetPassword = tryCatch(async (req, res) => {
  const { resetToken } = req.params;

  // Hash the reset token for comparison
  const hashedResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedResetToken,
    resetPasswordExpires: { $gt: Date.now() }, // Token not expired
  });

  res.render('auth/user/resetPassword', { user });
});

const resetPasswordPost = tryCatch(async (req, res) => {
  const sanitizedBody = sanitizeObject(req.body);
  const { password, confirmPassword } = sanitizedBody;
  const { resetToken } = req.params;

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters.',
    });
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: 'Passwords do not match.' });
  }

  const hashedResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Find the user with the provided reset token and check if it's still valid
  const user = await User.findOne({
    resetPasswordToken: hashedResetToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid or expired reset token.' });
  }

  // Update the password
  user.password = password; // Ensure this field is being hashed if using plain text
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  // Send reset confirmation email
  await resetPasswordMsg(user);

  return res.status(200).json({
    success: true,
    message: 'Password reset successfully. Please log in.',
  });
});

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
  forgetPassword,
  forgetPasswordPost,
  resetPassword,
  resetPasswordPost,
  userLogin,
  userLoginPost,
  userRefreshToken,
};
