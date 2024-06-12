'use strict';
const express = require('express');
const router = express.Router();
const { authAdminController } = require('../controllers');
const {
  isUserSignedIn,
  isAdminSignedIn,
  verifyAdminToken,
} = require('../middlewares');

router.get(
  '/register',
  isUserSignedIn,
  isAdminSignedIn,
  authAdminController.registerAdmin
);

router.post(
  '/registerAdminPost',
  isUserSignedIn,
  isAdminSignedIn,
  authAdminController.registerAdminPost
);

router.get(
  '/login',
  isUserSignedIn,
  isAdminSignedIn,
  authAdminController.adminLogin
);
router.post(
  '/adminLoginPost',
  isUserSignedIn,
  isAdminSignedIn,
  authAdminController.adminLoginPost
);

router.post(
  '/adminRefreshToken',
  verifyAdminToken,
  authAdminController.adminRefreshToken
);

module.exports = router;
