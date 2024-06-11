'use strict';
const express = require('express');
const router = express.Router();
const { authAdminController } = require('../controllers');
const {
  isUserSignedIn,
  isAdminSignedIn,
  verifyAdminToken,
} = require('../middlewares');

router.get('/registerAdmin', authAdminController.registerAdmin);

module.exports = router;
