const multer = require('multer');


// Multer config


const reportImage = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, './public/reportImage/'); // Adjust path as needed
      },
      filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now());
      }
    }),
    limits: {
      fileSize: 1000000, // Adjust limit in bytes (here, 1MB)
    },
});
  


module.exports ={reportImage};

