'use strict';
const express = require('express');
const router = express.Router();
const { verifyAdminToken, getAdminById } = require('../middlewares');
const { User } = require('../models');
const { adminController } = require('../controllers');
const { adminImage } = require('../configs/multer');
const { paginatedResults, userBeneficiaryFilter } = require('../utils');

router.get(
  '/index',
  verifyAdminToken,
  getAdminById,
  paginatedResults(User),
  adminController.adminIndexPage
);

router.post(
  '/uploadAdminImage',
  verifyAdminToken,
  getAdminById,
  adminImage.single('image'),
  adminController.uploadAdminImage
);

router.get(
  '/ourUsers',
  verifyAdminToken,
  getAdminById,
  paginatedResults(User),
  adminController.usersPage
);

router.get(
  '/addUser',
  verifyAdminToken,
  getAdminById,
  adminController.addNewUser
);

router.post(
  '/addUserPosted',
  verifyAdminToken,
  getAdminById,
  adminController.addUserPosted
);

router.post(
  '/ourUsers/updateAccountStatus',
  verifyAdminToken,
  getAdminById,
  adminController.updateAccountStatus
);

router.get(
  '/viewUser/:userId',
  verifyAdminToken,
  getAdminById,
  adminController.viewUser
);

router.get(
  '/editUser/:userId',
  verifyAdminToken,
  getAdminById,
  adminController.editUser
);

router.put(
  '/editUserPost/:userId',
  verifyAdminToken,
  getAdminById,
  adminController.editUserPost
);
module.exports = router;
