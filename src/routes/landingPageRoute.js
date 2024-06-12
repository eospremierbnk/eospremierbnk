'use strict';
const express = require('express');
const router = express.Router();
const { landingPageController } = require('../controllers');

router.get('/', landingPageController.indexPage);
router.get('/single', landingPageController.singlePage);
router.post('/contactPagePost', landingPageController.contactUsPost);

module.exports = router;
