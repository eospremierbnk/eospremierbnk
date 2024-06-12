'use strict';
const config = require('../configs/customEnvVariables');
const bcrypt = require('bcryptjs');
const { tryCatch } = require('../middlewares');
const APIError = require('../errorHandlers/apiError');
const cloudinary = require('../configs/cloudinary');
const { User } = require('../models');
const { newsLetterSchema } = require('../validations');
const { updateUserProfileMsg } = require('../mailers');
const { sanitizeInput, sanitizeObject } = require('../utils');

const userLandingPage = tryCatch(async (req, res) => {
  const user = req.currentUser;
  res.render('user/index', { user });
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

module.exports = { userLandingPage, editUserProfile, editUserProfilePost };
