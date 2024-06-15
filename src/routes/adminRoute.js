'use strict';
const express = require('express');
const router = express.Router();
const { verifyAdminToken, getAdminById } = require('../middlewares');
const { User, ContactUs, Transaction } = require('../models');
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

router.get(
  '/accountStatement',
  verifyAdminToken,
  getAdminById,
  paginatedResults(Transaction),
  adminController.statementPage
);

router.get(
  '/addNewStatement',
  verifyAdminToken,
  getAdminById,
  adminController.addNewStatementPage
);

router.get(
  '/chatting',
  verifyAdminToken,
  getAdminById,
  adminController.chatWithUser
);

router.get(
  '/settings',
  verifyAdminToken,
  getAdminById,
  adminController.editAdminProfile
);

router.put(
  '/editAdminProfile',
  verifyAdminToken,
  getAdminById,
  adminController.editAdminProfilePost
);

router.get(
  '/contactUs',
  verifyAdminToken,
  getAdminById,
  paginatedResults(ContactUs),
  adminController.contactUsPage
);

router.delete(
  '/deleteContactUs/:contactUsId',
  verifyAdminToken,
  getAdminById,
  adminController.deleteContactUs
);

router.delete(
  '/logoutAdmin',
  verifyAdminToken,
  getAdminById,
  adminController.logoutAdmin
);

module.exports = router;
