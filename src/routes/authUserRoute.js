'use strict';
const express = require('express');
const router = express.Router();
const {
  verifyUserToken,
  isUserSignedIn,
  isAdminSignedIn,
} = require('../middlewares');
const { authuserController } = require('../controllers');

router.get(
  '/register',
  isUserSignedIn,
  isAdminSignedIn,
  authuserController.registerUser
);

// checkExistingUser route
router.get('/checkExistingUser', authuserController.checkExistingUser);

router.post('/registerUserPost', authuserController.registerUserPost);

// User Login route with verifyAccessToken middleware
router.get(
  '/login',
  isUserSignedIn,
  isAdminSignedIn,
  authuserController.loginPage
);

// router.post(
//   '/userLoginPost',
//   isUserSignedIn,
//   isMerchantSignedIn,
//   isAdminSignedIn,
//   authuserController.userLoginPost
// );

// router.post('/userRefreshToken', verifyUserToken, authuserController.userRefreshToken);

module.exports = router;
