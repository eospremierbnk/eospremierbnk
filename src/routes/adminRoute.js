'use strict';
const express = require('express');
const router = express.Router();
const { verifyAdminToken, getAdminById } = require('../middlewares');
const { Merchant, User } = require('../models');
const { adminController } = require('../controllers');
const { adminImage } = require('../configs/multer');
const { paginatedResults } = require('../utils');

router.get('/index', adminController.adminIndexPage);

module.exports = router;
