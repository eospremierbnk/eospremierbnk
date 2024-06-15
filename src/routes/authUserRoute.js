'use strict';
const express = require('express');
const router = express.Router();
const {
  verifyUserToken,
  isUserSignedIn,
  isAdminSignedIn,
} = require('../middlewares');
const { authuserController } = require('../controllers');

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
