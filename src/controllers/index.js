// Importing controllers
const landingPageController = require('../controllers/landingPageController');

const authUserController = require('../controllers/authUserController');
const userController = require('../controllers/userController');

const authAdminController = require('../controllers/authAdminController');
const adminController = require('../controllers/adminController');

module.exports = {
  // Exporting auth user controller functions
  landingPageController: { ...landingPageController },

  // Exporting auth user controller functions
  authuserController: { ...authUserController },

  // Exporting user controller functions
  userController: { ...userController },

  // Exporting auth admin controller functions
  authAdminController: { ...authAdminController },

  // Exporting admin controller functions
  adminController: { ...adminController },
};
