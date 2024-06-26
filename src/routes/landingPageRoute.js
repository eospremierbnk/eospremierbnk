'use strict';
const express = require('express');
const router = express.Router();
const { landingPageController } = require('../controllers');
const { isUserSignedIn, isAdminSignedIn } = require('../middlewares');

router.get(
  '/',
  isUserSignedIn,
  isAdminSignedIn,
  landingPageController.indexPage
);
router.post(
  '/contactPagePost',
  isUserSignedIn,
  isAdminSignedIn,
  landingPageController.contactUsPost
);

module.exports = router;
