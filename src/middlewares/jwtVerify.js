const jwt = require('jsonwebtoken');
const config = require('../../src/configs/customEnvVariables');
const { Blacklist } = require('../models');
const logger = require('../../logger/logger');

// verifyUserToken middleware
const verifyUserToken = async (req, res, next) => {
  try {
    const userAccessToken = req.cookies.userAccessToken;
    const userRefreshToken = req.cookies.userRefreshToken;

    if (!userAccessToken || !userRefreshToken) {
      req.session.authErrorMessage = 'Please sign in to access this page';
      return res.redirect('/auth/user/login');
    }

    const checkIfBlacklisted = await Blacklist.findOne({
      token: { $in: [userAccessToken, userRefreshToken] },
    });
    if (checkIfBlacklisted) {
      req.session.authErrorMessage = 'This session has expired. Please login';
      return res.redirect('/auth/user/login');
    }

    // Verify access token
    jwt.verify(
      userAccessToken,
      config.jwtSecret,
      (err, decodedUserAccessToken) => {
        if (err) {
          // If access token verification fails, check refresh token
          jwt.verify(
            userRefreshToken,
            config.jwtSecret,
            async (err, decodedUserRefreshToken) => {
              if (err) {
                // Both tokens are invalid, return unauthorized
                req.session.authErrorMessage =
                  'Please sign in to access this page';
                return res.redirect('/auth/user/login');
              } else {
                // Refresh token is valid, generate a new access token
                const newUserAccessToken = jwt.sign(
                  { id: decodedUserRefreshToken.id, userRole: 'User' },
                  config.jwtSecret,
                  { expiresIn: config.userAccessTokenExpireTime }
                );
                // Set new access token in cookies
                res.cookie('userAccessToken', newUserAccessToken, {
                  httpOnly: true,
                  secure: true,
                });
                req.user = decodedUserRefreshToken;
                next();
              }
            }
          );
        } else {
          // Access token is valid
          req.user = decodedUserAccessToken;
          next();
        }
      }
    );
  } catch (error) {
    logger.error(error);
    req.session.authErrorMessage = 'An error occurred. Please try again.';
    return res.redirect('/auth/user/login');
  }
};

const verifyAdminToken = async (req, res, next) => {
  try {
    const adminAccessToken = req.cookies.adminAccessToken;
    const adminRefreshToken = req.cookies.adminRefreshToken;

    if (!adminAccessToken || !adminRefreshToken) {
      req.session.authErrorMessage = 'Please sign in to access this page';
      return res.redirect('/auth/admin/login');
    }

    const checkIfBlacklisted = await Blacklist.findOne({
      token: { $in: [adminAccessToken, adminRefreshToken] },
    });
    if (checkIfBlacklisted) {
      req.session.authErrorMessage = 'This session has expired. Please login';
      return res.redirect('/auth/admin/login');
    }

    jwt.verify(
      adminAccessToken,
      config.jwtSecret,
      (err, decodedAdminAccessToken) => {
        if (err) {
          jwt.verify(
            adminRefreshToken,
            config.jwtSecret,
            async (err, decodedAdminRefreshToken) => {
              if (err) {
                req.session.authErrorMessage =
                  'Please sign in to access this page';
                return res.redirect('/auth/admin/login');
              } else {
                const newAdminAccessToken = jwt.sign(
                  { id: decodedAdminRefreshToken.id, adminRole: 'Admin' },
                  config.jwtSecret,
                  { expiresIn: config.adminAccessTokenExpireTime }
                );
                res.cookie('adminAccessToken', newAdminAccessToken, {
                  httpOnly: true,
                  secure: true,
                });
                req.user = decodedAdminRefreshToken;
                next();
              }
            }
          );
        } else {
          req.user = decodedAdminAccessToken;
          next();
        }
      }
    );
  } catch (error) {
    logger.error(error);
    req.session.authErrorMessage = 'An error occurred. Please try again.';
    return res.redirect('/auth/admin/login');
  }
};

//checking if users are logged in
const verifyToken = (tokenType, redirectUrl) => (req, res, next) => {
  const accessToken = req.cookies[`${tokenType}AccessToken`];
  const refreshToken = req.cookies[`${tokenType}RefreshToken`];

  if (accessToken && refreshToken) {
    jwt.verify(accessToken, config[`${tokenType}AccessToken`], (err) => {
      if (err) {
        next(); // If access token is invalid, continue to the next middleware
      } else {
        return res.redirect(redirectUrl);
      }
    });
  } else {
    next(); // Continue to the next middleware if tokens are missing
  }
};

const isUserSignedIn = verifyToken('user', '/user/index');
const isAdminSignedIn = verifyToken('admin', '/admin/index');

module.exports = {
  verifyUserToken,
  isUserSignedIn,
  verifyAdminToken,
  isAdminSignedIn,
};
