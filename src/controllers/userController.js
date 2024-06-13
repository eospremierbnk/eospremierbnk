'use strict';
const config = require('../configs/customEnvVariables');
const bcrypt = require('bcryptjs');
const { tryCatch } = require('../middlewares');
const APIError = require('../errorHandlers/apiError');
const { User, Beneficiary, Purchase } = require('../models');
const { beneficiarySchema } = require('../validations');
const { updateUserProfileMsg } = require('../mailers');
const { sanitizeInput, sanitizeObject } = require('../utils');

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

  // Handle the uploaded file
  const file = req.file;
  if (!file) {
    throw new APIError('No file uploaded', 400);
  }

  image: {
    data: fs.readFileSync(path.join(__dirname, '../public/userImage/' + req.file.filename)),
    contentType: 'image/png'
  };

  user.image = image;
  await user.save();

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
  const sanitizedIdNumber = sanitizeInput(req.body.idNumber);
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
        idNumber: sanitizedIdNumber,
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
    $or: [{ email: value.email }, { idNumber: value.idNumber }],
  });

  if (beneficiary) {
    const errors = [];
    if (beneficiary.email === value.email) {
      errors.push({ key: 'email', msg: 'Email already registered' });
    }
    if (beneficiary.idNumber === value.idNumber) {
      errors.push({ key: 'idNumber', msg: 'Id number already registered' });
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
    idNumber,
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
    idNumber,
    accountType,
    relationship,
    userId: user._id,
    date_added: Date.now(),
  });

  await newBeneficiary.save();
  const redirectUrl = '/user/beneficiary';

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
  const {
    firstName,
    lastName,
    email,
    username,
    address,
    city,
    state,
    oldPassword,
    newPassword,
  } = sanitizeObject(req.body);

  let hashedPassword = user.password;
  if (oldPassword && newPassword) {
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new APIError('Old password does not match', 400);
    }
    hashedPassword = await bcrypt.hash(newPassword, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      $set: {
        firstName,
        lastName,
        email,
        username,
        address,
        city,
        state,
        password: hashedPassword,
      },
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
  const userId = req.currentUser._id;
  const user = await User.findById(userId).select('accountNumber swiftCode');

  res.render('user/fundTransfer', { user });
});

const fundsTransferPost = tryCatch(async (req, res) => {
  const user = req.currentUser;
  const { amount, description } = req.body;

  const newPurchase = new Purchase({
    amount,
    description,
    userId: user._id,
    date_added: Date.now(),
  });

  await newPurchase.save();
  const redirectUrl = '/user/beneficiary';

  res.status(201).json({
    user,
    redirectUrl,
    success: true,
    message: 'Beneficiary added successfully',
  });
});

const deatailsPage = tryCatch(async (req, res) => {
  const user = req.currentUser._id;

  res.render('user/accountDetails', { user });
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
  fundsTransferPost,
  deatailsPage,
};
