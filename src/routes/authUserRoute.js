'use strict';
const express = require('express');
const router = express.Router();
const {
  verifyUserToken,
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
} = require('../middlewares');
const { authuserController } = require('../controllers');

// USER ROUTES
// Registration route
router.get('/register', authuserController.registerUser);

module.exports = router;
