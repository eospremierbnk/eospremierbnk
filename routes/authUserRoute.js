'use strict';
const express = require('express');
const router = express.Router();
const {
  verifyUserToken,
  isUserSignedIn,
  isAdminSignedIn,
} = require('../middlewares');
const { authuserController } = require('../controllers');

//forgetPassword Routes
router.get(
  '/forgetPassword',
  isUserSignedIn,
  isAdminSignedIn,
  authuserController.forgetPassword
);
router.post(
  '/forgetPasswordPost',
  isUserSignedIn,
  isAdminSignedIn,
  authuserController.forgetPasswordPost
);

//ResettingPassword Routes
router.get(
  '/resetPassword/:resetToken',
  isUserSignedIn,
  isAdminSignedIn,
  authuserController.resetPassword
);
router.post(
  '/resetPasswordPost/:resetToken',
  isUserSignedIn,
  isAdminSignedIn,
  authuserController.resetPasswordPost
);

// User Login route with verifyAccessToken middleware
router.get(
  '/login',
  isUserSignedIn,
  isAdminSignedIn,
  authuserController.userLogin
);

router.post(
  '/userLoginPost',
  isUserSignedIn,
  isAdminSignedIn,
  authuserController.userLoginPost
);

router.post(
  '/userRefreshToken',
  verifyUserToken,
  authuserController.userRefreshToken
);

module.exports = router;
