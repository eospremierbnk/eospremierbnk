'use strict';

const { User, Admin } = require('../models');
const APIError = require('../errorHandlers/apiError');
const logger = require('../logger/logger');

const tryCatch = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new APIError('User not found', 404);
    }

    if (user.image && user.image.data) {
      user.imageBase64 = user.image.data.toString('base64');
    }

    req.currentUser = user;
    next();
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const getAdminById = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      throw new APIError('Admin not found', 404);
    }
    // Encode the image data in base64 if it exists
    if (admin.image && admin.image.data) {
      admin.imageBase64 = admin.image.data.toString('base64');
    }
    req.currentAdmin = admin;
    next();
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

module.exports = { tryCatch, getUserById, getAdminById };
