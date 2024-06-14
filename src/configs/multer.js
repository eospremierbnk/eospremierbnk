const multer = require('multer');
const path = require('path');

const userImage = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, '../public/userImage/'));
    },
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + '_' + Date.now() + path.extname(file.originalname)
      );
    },
  }),
  limits: { fileSize: 1000000 }, // 1MB limit
});

const adminImage = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, '../public/adminImage/'));
    },
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + '_' + Date.now() + path.extname(file.originalname)
      );
    },
  }),
  limits: { fileSize: 1000000 }, // 1MB limit
});
module.exports = { userImage, adminImage };
