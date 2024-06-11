'use strict';
const express = require('express');
const router = express.Router();
const { isUserSignedIn } = require('../middlewares');
const { landingPageController } = require('../controllers');

router.get('/', landingPageController.indexPage);
router.get('/single', landingPageController.singlePage);
router.post('/contactPagePost', landingPageController.contactUsPost);
router.get('/auth/user/login', landingPageController.loginPage);

module.exports = router;
