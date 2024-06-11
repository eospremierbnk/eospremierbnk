'use strict';
const express = require('express');
const router = express.Router();
const { isUserSignedIn, isMerchantSignedIn } = require('../middlewares');
const { landingPageController } = require('../controllers');

router.get('/index', landingPageController.indexPage);

module.exports = router;
