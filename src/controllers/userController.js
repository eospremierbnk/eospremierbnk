'use strict';
const fs = require('fs').promises;
const path = require('path');
const { tryCatch } = require('../middlewares');
const APIError = require('../errorHandlers/apiError');
const {
  User,
  Beneficiary,
  Purchase,
  Blacklist,
  UserMessage,
} = require('../models');
const { beneficiarySchema, contactAdminSchema } = require('../validations');
const {
  sanitizeInput,
  sanitizeObject,
  generateOTP,
  generateLastOTP,
} = require('../utils');
const {
  updateUserProfileMsg,
  sendOTPByEmail,
  addBeneficiaryMsg,
  resenderSendOTPByEmail,
} = require('../mailers');

const userLandingPage = tryCatch(async (req, res) => {
  const user = req.currentUser;
  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }

  const latestPurchase = await Purchase.find({})
    .sort({ date_added: -1 })
    .limit(8)
    .exec();

  const { results, currentPage, totalPages } = res.paginatedResults;
  res.render('user/index', {
    user,
    latestPurchase,
    userTransaction: results,
    currentPage,
    totalPages,
  });
});

const uploadUserImage = tryCatch(async (req, res) => {
  const user = req.currentUser;
  const file = req.file;

  if (!file) {
    throw new APIError('No file uploaded', 400);
  }

  const imagePath = path.resolve(
    __dirname,
    '../public/userImage/',
    file.filename
  );

  const imageData = await fs.readFile(imagePath);

  user.image = {
    data: imageData,
    contentType: file.mimetype || 'image/png',
  };

  await user.save();
  await fs.unlink(imagePath);

  const callbackUrl = '/user/index';
  return res.status(200).json({
    callbackUrl,
    success: true,
    message: 'Image uploaded successfully',
  });
});

const beneficiaryList = tryCatch((req, res) => {
  const user = req.currentUser;
  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }
  const { results, currentPage, totalPages } = res.paginatedResults;
  res.render('user/beneficiary', {
    user,
    beneficiaries: results,
    currentPage,
    totalPages,
  });
});

const viewBeneficiary = tryCatch(async (req, res) => {
  const user = req.currentUser;
  const beneficiaryInfo = await Beneficiary.findOne({
    _id: req.params.beneficiaryId,
  });
  if (!beneficiaryInfo) {
    throw new APIError('Beneficiary information not found', 404);
  }
  res.status(200).json({ success: true, beneficiaryInfo, user });
});

const editBeneficiary = tryCatch(async (req, res) => {
  const beneficiaryId = req.params.beneficiaryId;
  const editBeneficiaryInfo = await Beneficiary.findById(beneficiaryId);

  if (!editBeneficiaryInfo) {
    throw new APIError('Beneficiary information not found', 404);
  }

  res.status(200).json({ success: true, editBeneficiaryInfo });
});

const editBeneficiaryPost = tryCatch(async (req, res) => {
  const user = req.currentUser;
  const beneficiaryId = req.params.beneficiaryId;

  // Sanitize each input field
  const sanitizedFirstName = sanitizeInput(req.body.firstName);
  const sanitizedLastName = sanitizeInput(req.body.lastName);
  const sanitizedEmail = sanitizeInput(req.body.email);
  const sanitizedNumber = sanitizeInput(req.body.number);
  const sanitizedIdCheckingAccountNumber = sanitizeInput(
    req.body.checkingAccountNumber
  );
  const sanitizedAccountType = sanitizeInput(req.body.accountType);
  const sanitizedRelationship = sanitizeInput(req.body.relationship);
  const sanitizedAddress = sanitizeInput(req.body.address);
  const sanitizedCity = sanitizeInput(req.body.city);
  const sanitizedState = sanitizeInput(req.body.state);
  const sanitizedZipcode = sanitizeInput(req.body.zipcode);

  const updatedBeneficiary = await Beneficiary.findByIdAndUpdate(
    beneficiaryId,
    {
      $set: {
        firstName: sanitizedFirstName,
        lastName: sanitizedLastName,
        email: sanitizedEmail,
        number: sanitizedNumber,
        checkingAccountNumber: sanitizedIdCheckingAccountNumber,
        accountType: sanitizedAccountType,
        relationship: sanitizedRelationship,
        address: sanitizedAddress,
        city: sanitizedCity,
        state: sanitizedState,
        zipcode: sanitizedZipcode,
        userId: user._id,
      },
    },
    { new: true }
  );

  if (!updatedBeneficiary) {
    throw new APIError('Beneficiary not found', 404);
  }

  const redirectUrl = '/user/beneficiary';

  res.status(201).json({
    user,
    redirectUrl,
    success: true,
    message: 'Beneficiary successfully updated',
  });
});

const deleteBeneficiary = tryCatch(async (req, res) => {
  const user = req.currentUser;
  const beneficiaryInfo = await Beneficiary.findById(req.params.beneficiaryId);
  if (!beneficiaryInfo) {
    throw new APIError('Beneficiary information not found', 404);
  }

  await Beneficiary.findByIdAndDelete(req.params.beneficiaryId);
  const redirectUrl = '/user/beneficiary';

  res.status(201).json({
    redirectUrl,
    success: true,
    beneficiaryInfo,
    user,
    message: 'Beneficiary deleted successfully',
  });
});

const addBeneficiary = tryCatch((req, res) => {
  const user = req.currentUser;
  res.render('user/addBeneficiary', { user });
});

const addBeneficiaryPosted = tryCatch(async (req, res) => {
  const user = req.currentUser;
  const sanitizedBody = sanitizeObject(req.body);
  const { error, value } = beneficiarySchema.validate(sanitizedBody, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((err) => ({
      key: err.path[0],
      msg: err.message,
    }));
    return res.status(400).json({ success: false, errors });
  }

  const beneficiary = await Beneficiary.findOne({
    $or: [
      { email: value.email },
      { checkingAccountNumber: value.checkingAccountNumber },
    ],
  });

  if (beneficiary) {
    const errors = [];
    if (beneficiary.email === value.email) {
      errors.push({ key: 'email', msg: 'Email already registered' });
    }
    if (beneficiary.idNumber === value.idNumber) {
      errors.push({
        key: 'checkingAccountNumber',
        msg: 'Account Number already registered',
      });
    }
    if (errors.length) {
      return res.status(409).json({ success: false, errors });
    }
  }

  const {
    firstName,
    lastName,
    email,
    number,
    address,
    city,
    state,
    zipcode,
    checkingAccountNumber,
    accountType,
    relationship,
  } = value;

  const newBeneficiary = new Beneficiary({
    firstName,
    lastName,
    email,
    number,
    address,
    city,
    state,
    zipcode,
    checkingAccountNumber,
    accountType,
    relationship,
    userId: user._id,
    date_added: Date.now(),
  });

  await newBeneficiary.save();
  const redirectUrl = '/user/beneficiary';

  await addBeneficiaryMsg(user);

  res.status(201).json({
    user,
    redirectUrl,
    success: true,
    message: 'Beneficiary added successfully',
  });
});

const editUserProfile = (req, res) => {
  const user = req.currentUser;
  res.render('user/settings', { user });
};

const editUserProfilePost = tryCatch(async (req, res) => {
  const user = req.currentUser;
  const { oldPassword, newPassword } = sanitizeObject(req.body);

  // Compare old password with the stored plain text password
  if (oldPassword && newPassword) {
    if (oldPassword !== user.password) {
      throw new APIError('Old password does not match', 400);
    }
  }

  const updatedFields = {};

  // Set the new plain text password if provided
  if (newPassword) {
    updatedFields.password = newPassword;
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      $set: updatedFields,
    },
    { new: true }
  );

  await updateUserProfileMsg(updatedUser);
  res
    .status(201)
    .json({ user, success: true, message: 'Profile updated successfully' });
});

const accountSummary = tryCatch(async (req, res) => {
  const user = req.currentUser;
  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }
  const { results, currentPage, totalPages } = res.paginatedResults;
  res.render('user/summary', {
    user,
    userTransaction: results,
    currentPage,
    totalPages,
  });
});

const fundsTransfer = tryCatch(async (req, res) => {
  const user = req.currentUser;
  const userInfo = await User.findById(user);

  res.render('user/localTransfer', { user, userInfo });
});

const internationTf = tryCatch(async (req, res) => {
  const user = req.currentUser;
  const userInfo = await User.findById(user);
  res.render('user/internalTransfer', { user, userInfo });
});

const processTransaction = tryCatch(async (req, res) => {
  const user = req.currentUser;
  const userInfo = await User.findById(user);
  res.render('user/transactionProcessing', { user, userInfo });
});

const generateOtp = tryCatch(async (req, res) => {
  const userId = req.currentUser;
  const user = await User.findById(userId);
  if (!user) {
    throw new APIError('User not found', 404);
  }

  const OTP = generateOTP();
  user.otp = OTP;
  await user.save();

  sendOTPByEmail(user, OTP);

  res.sendStatus(200);
});

const verifyingOtp = tryCatch(async (req, res) => {
  const userId = req.currentUser;
  const { otp } = req.body;
  const user = await User.findById(userId);

  if (!user) {
    throw new APIError('User not found', 404);
  }

  if (otp === user.otp) {
    user.otp = null;
    await user.save();
    const redirectUrl = '/user/completeTransaction';

    res.status(200).json({
      redirectUrl: '/user/completeTransaction',
      message: 'OTP verified successfully',
    });
  } else {
    res.status(400).json({ error: 'Invalid OTP' });
  }
});

const completeTransaction = tryCatch(async (req, res) => {
  const user = req.currentUser;
  const userInfo = await User.findById(user);

  // Generate and save new OTP
  const newOtp = generateLastOTP();
  user.otp = newOtp;
  await user.save();

  // Send the new OTP to the user's email
  await resenderSendOTPByEmail(user, newOtp);
  res.render('user/completeTransaction', { user, userInfo });
});

const chatWithAdmin = tryCatch((req, res) => {
  const user = req.currentUser;
  res.render('user/chatAdmin', { user });
});

const deatailsPage = tryCatch(async (req, res) => {
  const user = req.currentUser;
  res.render('user/accountDetails', { user });
});

const contactAdminPost = tryCatch(async (req, res) => {
  const sanitizedBody = sanitizeObject(req.body);

  const { error, value } = contactAdminSchema.validate(sanitizedBody, {
    abortEarly: false,
  });
  if (error) {
    const errors = error.details.map((err) => ({
      key: err.path[0],
      msg: err.message,
    }));
    return res.status(400).json({ success: false, errors });
  }

  const { firstName, lastName, message } = value;
  const newUserMessage = new UserMessage({
    firstName,
    lastName,
    message,
    date_added: Date.now(),
  });
  await newUserMessage.save();

  res.status(201).json({ success: true, message: 'Message successfully sent' });
});

const logoutUser = tryCatch(async (req, res) => {
  const userAccessToken = req.cookies.userAccessToken;
  const userRefreshToken = req.cookies.userRefreshToken;
  const logoutRedirectUrl = '/index';

  if (userAccessToken || userRefreshToken) {
    // Blacklist both access and refresh tokens
    const newBlacklist = [
      { token: userAccessToken },
      { token: userRefreshToken },
    ];
    await Blacklist.insertMany(newBlacklist);
  }

  // Clear cookies
  res.setHeader('Clear-Site-Data', '"cookies"');
  res.clearCookie('userAccessToken');
  res.clearCookie('userRefreshToken');

  res
    .status(200)
    .json({ logoutRedirectUrl, success: true, message: 'You are logged out!' });
  res.end(); // End the response
});

module.exports = {
  userLandingPage,
  uploadUserImage,
  beneficiaryList,
  viewBeneficiary,
  editBeneficiary,
  editBeneficiaryPost,
  deleteBeneficiary,
  addBeneficiary,
  addBeneficiaryPosted,
  editUserProfile,
  editUserProfilePost,
  accountSummary,
  fundsTransfer,
  internationTf,
  processTransaction,
  generateOtp,
  verifyingOtp,
  completeTransaction,
  chatWithAdmin,
  deatailsPage,
  contactAdminPost,
  logoutUser,
};
