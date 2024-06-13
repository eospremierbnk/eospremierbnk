const multer = require('multer');

const userImage = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/userImage/');
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '_' + Date.now());
    },
  }),
  limits: {
    fileSize: 1000000,
  },
});

const adminImage = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/adminImage/');
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '_' + Date.now());
    },
  }),
  limits: {
    fileSize: 1000000,
  },
});

module.exports = { userImage, adminImage };
