'use strict';
const express = require('express');
const router = express.Router();
const { verifyUserToken, getUserById } = require('../middlewares');
const { Beneficiary, Transaction } = require('../models');
const { userImage } = require('../configs/multer');
const { userController } = require('../controllers');
const { paginatedResults, userBeneficiaryFilter } = require('../utils');

router.get(
  '/index',
  verifyUserToken,
  getUserById,
  paginatedResults(Transaction, userBeneficiaryFilter),
  userController.userLandingPage
);

router.post(
  '/uploadUserImage',
  verifyUserToken,
  getUserById,
  userImage.single('image'),
  userController.uploadUserImage
);

router.get(
  '/settings',
  verifyUserToken,
  getUserById,
  userController.editUserProfile
);

router.put(
  '/edituserProfile',
  verifyUserToken,
  getUserById,
  userController.editUserProfilePost
);

router.get(
  '/beneficiary',
  verifyUserToken,
  getUserById,
  paginatedResults(Beneficiary, userBeneficiaryFilter),
  userController.beneficiaryList
);

router.get(
  '/viewBeneficiary/:beneficiaryId',
  verifyUserToken,
  getUserById,
  userController.viewBeneficiary
);

router.get(
  '/editBeneficiary/:beneficiaryId',
  verifyUserToken,
  getUserById,
  userController.editBeneficiary
);
router.put(
  '/editBeneficiaryPost/:beneficiaryId',
  verifyUserToken,
  getUserById,
  userController.editBeneficiaryPost
);
router.delete(
  '/deleteBeneficiary/:beneficiaryId',
  verifyUserToken,
  getUserById,
  userController.deleteBeneficiary
);

router.get(
  '/addBeneficiary',
  verifyUserToken,
  getUserById,
  userController.addBeneficiary
);

router.post(
  '/accountBeneficiary',
  verifyUserToken,
  getUserById,
  userController.addBeneficiaryPosted
);

router.get(
  '/summary',
  verifyUserToken,
  getUserById,
  paginatedResults(Transaction, userBeneficiaryFilter),
  userController.accountSummary
);

router.get(
  '/localTransfer',
  verifyUserToken,
  getUserById,
  userController.fundsTransfer
);

router.get(
  '/internalTransfer',
  verifyUserToken,
  getUserById,
  userController.internationTf
);

router.get(
  '/transactionProcessing',
  verifyUserToken,
  getUserById,
  userController.processTransaction
);

router.post(
  '/sendOTP',
  verifyUserToken,
  getUserById,
  userController.generateOtp
);

router.post(
  '/verifyingOtp',
  verifyUserToken,
  getUserById,
  userController.verifyingOtp
);

router.get(
  '/completeTransaction',
  verifyUserToken,
  getUserById,
  userController.completeTransaction
);

router.get(
  '/chatAdmin',
  verifyUserToken,
  getUserById,
  userController.chatWithAdmin
);

router.get(
  '/accountDetails',
  verifyUserToken,
  getUserById,
  userController.deatailsPage
);

router.post(
  '/ChatAdminPost',
  verifyUserToken,
  getUserById,
  userController.contactAdminPost
);

router.delete(
  '/logoutUser',
  verifyUserToken,
  getUserById,
  userController.logoutUser
);

module.exports = router;
