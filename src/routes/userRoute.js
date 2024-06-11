'use strict';
const express = require('express');
const router = express.Router();
const { verifyUserToken, getUserById } = require('../middlewares');
const { Product, Order } = require('../models');
const { userImage, reportImage } = require('../configs/multer');
const { userController } = require('../controllers');

router.get('/index', userController.userLandingPage);

module.exports = router;
