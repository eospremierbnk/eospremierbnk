'use strict';
const express = require('express');
const router = express.Router();
const { verifyAdminToken, getAdminById } = require('../middlewares');
const { User, ContactUs, Transaction, UserMessage } = require('../models');
const { adminController } = require('../controllers');
const { adminImage } = require('../configs/multer');
const { paginatedResults } = require('../utils');

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

router.delete(
  '/deleteUser/:userId',
  verifyAdminToken,
  getAdminById,
  adminController.deleteUser
);

router.get(
  '/accountStatement',
  verifyAdminToken,
  getAdminById,
  paginatedResults(Transaction),
  adminController.accountStatement
);

router.get(
  '/addNewStatement',
  verifyAdminToken,
  getAdminById,
  adminController.addNewStatementPage
);

router.post(
  '/addNewStatementPost',
  verifyAdminToken,
  getAdminById,
  adminController.addNewStatementPost
);

router.get(
  '/editStatement/:transactionId',
  verifyAdminToken,
  getAdminById,
  adminController.editStatement
);

router.put(
  '/editStatementPost/:transactionId',
  verifyAdminToken,
  getAdminById,
  adminController.editStatementPost
);

router.delete(
  '/deleteTransaction/:transactionId',
  verifyAdminToken,
  getAdminById,
  adminController.deleteTransaction
);

router.get(
  '/chatting',
  verifyAdminToken,
  getAdminById,
  paginatedResults(UserMessage),
  adminController.chatWithUser
);

router.get(
  '/settings',
  verifyAdminToken,
  getAdminById,
  adminController.editAdminProfile
);

router.put(
  '/editAdminProfilePost',
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
