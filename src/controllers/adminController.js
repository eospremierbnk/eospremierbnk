'use strict';
const fs = require('fs').promises;
const path = require('path');
const { tryCatch } = require('../middlewares');
const APIError = require('../errorHandlers/apiError');
const { sendAccountStatusUpdateNotification } = require('../mailers');
const { Blacklist, User, ContactUs, Transaction, Admin } = require('../models');
const { sanitizeInput, sanitizeObject } = require('../utils');
const { userSchema } = require('../validations');

const adminIndexPage = tryCatch((req, res) => {
  const admin = req.currentAdmin;
  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }

  const { results, currentPage, totalPages } = res.paginatedResults;
  res.render('admin/index', {
    admin,
    ourUsers: results,
    currentPage,
    totalPages,
  });
});

const uploadAdminImage = tryCatch(async (req, res) => {
  const admin = req.currentAdmin;
  const file = req.file;

  if (!file) {
    throw new APIError('No file uploaded', 400);
  }

  const imagePath = path.resolve(
    __dirname,
    '../public/adminImage/',
    file.filename
  );

  const imageData = await fs.readFile(imagePath);
  admin.image = {
    data: imageData,
    contentType: file.mimetype || 'image/png',
  };

  await admin.save();
  await fs.unlink(imagePath);

  const callbackUrl = '/admin/index';
  return res.status(200).json({
    callbackUrl,
    success: true,
    message: 'Image uploaded successfully',
  });
});

const usersPage = tryCatch((req, res) => {
  const admin = req.currentAdmin;
  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }

  const { results, currentPage, totalPages } = res.paginatedResults;
  res.render('admin/ourUsers', {
    admin,
    ourUser: results,
    currentPage,
    totalPages,
  });
});

const addNewUser = tryCatch((req, res) => {
  const admin = req.currentAdmin;
  res.render('admin/addUser', { admin });
});

const addUserPosted = tryCatch(async (req, res) => {
  const sanitizedBody = sanitizeObject(req.body);
  const { error, value } = userSchema.validate(sanitizedBody, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((err) => ({
      key: err.path[0],
      msg: err.message,
    }));
    return res.status(400).json({ success: false, errors });
  }

  const user = await User.findOne({
    $or: [{ email: value.email }, { username: value.username }],
  });

  if (user) {
    const errors = [];
    if (user.email === value.email) {
      errors.push({ key: 'email', msg: 'Email already registered' });
    }
    if (user.username === value.username) {
      errors.push({ key: 'idNumber', msg: 'User already registered' });
    }
    if (errors.length) {
      return res.status(409).json({ success: false, errors });
    }
  }

  const {
    firstName,
    lastName,
    email,
    username,
    number,
    password,
    address,
    city,
    state,
    savingsAccountNumber,
    checkingAccountNumber,
    savingAccountBalance,
    checkingAccountBalance,
    pin,
  } = value;

  const newUser = new User({
    firstName,
    lastName,
    email,
    username,
    number,
    password,
    address,
    city,
    state,
    savingsAccountNumber,
    checkingAccountNumber,
    savingAccountBalance,
    checkingAccountBalance,
    pin,
    date_added: Date.now(),
  });

  await newUser.save();
  const redirectUrl = '/admin/ourUsers';

  res.status(201).json({
    redirectUrl,
    success: true,
    message: 'User added successfully',
  });
});

const updateAccountStatus = tryCatch(async (req, res) => {
  const { userId, accountStatus } = req.body;
  const validStatuses = ['Active', 'Locked'];

  if (!validStatuses.includes(accountStatus)) {
    throw new APIError('Invalid account status', 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new APIError('User not found', 404);
  }

  user.accountStatus = accountStatus;
  await user.save();

  await sendAccountStatusUpdateNotification(user);

  res.status(200).json({ message: 'Account status updated successfully' });
});

const viewUser = tryCatch(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw new APIError('User information not found', 404);
  }

  res.status(200).json({ success: true, userInfo: user });
});

const editUser = tryCatch(async (req, res) => {
  const userId = req.params.userId;
  const editUserInfo = await User.findById(userId);
  if (!editUserInfo) {
    throw new APIError('User information not found', 404);
  }

  res.status(200).json({ success: true, editUserInfo });
});

const editUserPost = tryCatch(async (req, res) => {
  const userId = req.params.userId;

  const sanitizedFirstName = sanitizeInput(req.body.firstName);
  const sanitizedLastName = sanitizeInput(req.body.lastName);
  const sanitizedEmail = sanitizeInput(req.body.email);
  const sanitizedUsername = sanitizeInput(req.body.username);
  const sanitizedPassword = sanitizeInput(req.body.password);
  const sanitizedNumber = sanitizeInput(req.body.number);
  const sanitizedAddress = sanitizeInput(req.body.address);
  const sanitizedCity = sanitizeInput(req.body.city);
  const sanitizedState = sanitizeInput(req.body.state);
  const sanitizedSavingsAccountNumber = sanitizeInput(
    req.body.savingsAccountNumber
  );
  const sanitizedCheckingAccountNumber = sanitizeInput(
    req.body.checkingAccountNumber
  );
  const sanitizedSavingAccountType = sanitizeInput(req.body.savingAccountType);
  const sanitizedCheckingAccountType = sanitizeInput(
    req.body.checkingAccountType
  );
  const sanitizedInternalRef = sanitizeInput(req.body.internalRef);
  const sanitizedSavingAccountBalance = sanitizeInput(
    req.body.savingAccountBalance
  );
  const sanitizedCheckingAccountBalance = sanitizeInput(
    req.body.checkingAccountBalance
  );
  const sanitizedPin = sanitizeInput(req.body.pin);
  const sanitizedCardBalance = sanitizeInput(req.body.cardBalance);
  const sanitizedCardNumber = sanitizeInput(req.body.CardNumber);

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        firstName: sanitizedFirstName,
        lastName: sanitizedLastName,
        email: sanitizedEmail,
        username: sanitizedUsername,
        password: sanitizedPassword,
        number: sanitizedNumber,
        address: sanitizedAddress,
        city: sanitizedCity,
        state: sanitizedState,
        savingsAccountNumber: sanitizedSavingsAccountNumber,
        checkingAccountNumber: sanitizedCheckingAccountNumber,
        savingAccountType: sanitizedSavingAccountType,
        checkingAccountType: sanitizedCheckingAccountType,
        internalRef: sanitizedInternalRef,
        savingAccountBalance: sanitizedSavingAccountBalance,
        checkingAccountBalance: sanitizedCheckingAccountBalance,
        cardBalance: sanitizedCardBalance,
        cardNumber: sanitizedCardNumber,
        pin: sanitizedPin,
      },
    },
    { new: true }
  );

  if (!updatedUser) {
    throw new APIError('User not found', 404);
  }

  const redirectUrl = '/admin/ourUsers';

  res.status(201).json({
    user: updatedUser,
    redirectUrl,
    success: true,
    message: 'User successfully updated',
  });
});

const deleteUser = tryCatch(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    throw new APIError('User information not found', 404);
  }

  await User.findByIdAndDelete(user);
  const redirectUrl = '/admin/ourUsers';

  res.status(201).json({
    redirectUrl,
    success: true,
    message: 'User deleted successfully',
  });
});

const accountStatement = tryCatch((req, res) => {
  const admin = req.currentAdmin;
  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }
  const { results, currentPage, totalPages } = res.paginatedResults;
  res.render('admin/accountStatement', {
    admin,
    userTransaction: results,
    currentPage,
    totalPages,
  });
});

const addNewStatementPage = tryCatch(async (req, res) => {
  const admin = req.currentAdmin;
  const users = await User.find();
  res.render('admin/addNewStatement', {
    admin,
    users,
  });
});

const addNewStatementPost = tryCatch(async (req, res) => {
  const sanitizedBody = sanitizeObject(req.body);

  const { userId, amount, type, description, paidIn, paidOut } = sanitizedBody;

  const newTransaction = new Transaction({
    userId,
    amount,
    type,
    description,
    paidIn,
    paidOut,
    date_added: Date.now(),
  });

  await newTransaction.save();
  const redirectUrl = '/admin/accountStatement';

  res.status(201).json({
    redirectUrl,
    success: true,
    message: 'Transaction added successfully',
  });
});

const editStatement = tryCatch(async (req, res) => {
  const transactionId = req.params.transactionId;
  const editTransactionInfo = await Transaction.findById(transactionId);

  if (!editTransactionInfo) {
    throw new APIError('Transaction information not found', 404);
  }

  res.status(200).json({ success: true, editTransactionInfo });
});

const editStatementPost = tryCatch(async (req, res) => {
  const transactionId = req.params.transactionId;

  // Sanitize each input field
  const sanitizedAmount = sanitizeInput(req.body.amount);
  const sanitizedType = sanitizeInput(req.body.type);
  const sanitizedDescription = sanitizeInput(req.body.description);
  const sanitizedPaidIn = sanitizeInput(req.body.paidIn);
  const sanitizedIdPaidOut = sanitizeInput(req.body.paidOut);

  const updatedTransaction = await Transaction.findByIdAndUpdate(
    transactionId,
    {
      $set: {
        amount: sanitizedAmount,
        type: sanitizedType,
        description: sanitizedDescription,
        paidIn: sanitizedPaidIn,
        paidOut: sanitizedIdPaidOut,
      },
    },
    { new: true }
  );

  if (!updatedTransaction) {
    throw new APIError('Transaction not found', 404);
  }

  const redirectUrl = '/admin/accountStatement';

  res.status(201).json({
    redirectUrl,
    success: true,
    message: 'Statement successfully updated',
  });
});

const deleteTransaction = tryCatch(async (req, res) => {
  const admin = req.currentAdmin;
  const transactionInfo = await Transaction.findById(req.params.transactionId);
  if (!transactionInfo) {
    throw new APIError('Transaction information not found', 404);
  }

  await Transaction.findByIdAndDelete(req.params.transactionId);
  const redirectUrl = '/admin/accountStatement';

  res.status(201).json({
    redirectUrl,
    success: true,
    transactionInfo,
    admin,
    message: 'Transaction deleted successfully',
  });
});

const chatWithUser = tryCatch((req, res) => {
  const admin = req.currentAdmin;
  res.render('admin/chatting', { admin });
});

const editAdminProfile = (req, res) => {
  const admin = req.currentAdmin;
  res.render('admin/settings', { admin });
};

const editAdminProfilePost = tryCatch(async (req, res) => {
  const admin = req.currentAdmin;
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

  let updatedPassword = admin.password;

  if (oldPassword && newPassword) {
    if (oldPassword !== admin.password) {
      throw new APIError('Old password does not match', 400);
    }
    updatedPassword = newPassword;
  }

  const updatedAdmin = await Admin.findByIdAndUpdate(
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
        password: updatedPassword,
      },
    },
    { new: true }
  );

  // Respond with a success message
  res.status(201).json({
    admin,
    success: true,
    message: 'Profile updated successfully',
  });
});

const contactUsPage = tryCatch(async (req, res) => {
  const admin = req.currentAdmin;
  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }
  // Fetch the total count of contact messages
  const contactMessagesCount = await ContactUs.countDocuments();

  // Add the count to locals for use in the sidebar
  res.locals.contactMessagesCount = contactMessagesCount;

  const { results, currentPage, totalPages } = res.paginatedResults;
  res.render('admin/contactUs', {
    admin,
    contact: results,
    currentPage,
    totalPages,
  });
});

const deleteContactUs = tryCatch(async (req, res) => {
  const admin = req.currentAdmin;
  const contactUsInfo = await ContactUs.findById(req.params.contactUsId);
  if (!contactUsInfo) {
    throw new APIError('Contact information not found', 404);
  }

  await ContactUs.findByIdAndDelete(req.params.contactUsId);
  const redirectUrl = '/admin/contactUs';

  res.status(201).json({
    redirectUrl,
    success: true,
    contactUsInfo,
    admin,
    message: 'Contact deleted successfully',
  });
});

const logoutAdmin = tryCatch(async (req, res) => {
  const adminAccessToken = req.cookies.adminAccessToken;
  const adminRefreshToken = req.cookies.adminRefreshToken;
  const logoutRedirectUrl = '/index';

  if (adminAccessToken || adminRefreshToken) {
    // Blacklist both access and refresh tokens
    const newBlacklist = [
      { token: adminAccessToken },
      { token: adminRefreshToken },
    ];
    await Blacklist.insertMany(newBlacklist);
  }

  // Clear cookies
  res.setHeader('Clear-Site-Data', '"cookies"');
  res.clearCookie('adminAccessToken');
  res.clearCookie('adminRefreshToken');

  res
    .status(200)
    .json({ logoutRedirectUrl, success: true, message: 'You are logged out!' });
  res.end(); // End the response
});

module.exports = {
  adminIndexPage,
  uploadAdminImage,
  usersPage,
  addNewUser,
  addUserPosted,
  updateAccountStatus,
  viewUser,
  editUser,
  editUserPost,
  deleteUser,
  accountStatement,
  addNewStatementPage,
  addNewStatementPost,
  editStatement,
  editStatementPost,
  deleteTransaction,
  chatWithUser,
  editAdminProfile,
  editAdminProfilePost,
  contactUsPage,
  deleteContactUs,
  logoutAdmin,
};
