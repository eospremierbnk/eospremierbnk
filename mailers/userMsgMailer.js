const nodemailer = require(`nodemailer`);
const logger = require('../logger/logger');
const config = require('../configs/customEnvVariables');

// Send email to the applicant
const transporter = nodemailer.createTransport({
  service: config.mailerService,
  auth: {
    user: config.nodemailerEmail,
    pass: config.nodemailerPassword,
  },
});

const phoneNumber = config.companyNumber;
const emailAddress = config.companyEmail;

// Contact For Any Queries Messages
const contactQueriesMsg = async (newContactUs) => {
  const msg = `
  <p><img src="cid:logo" alt="logo" style="width: 100%; max-width: 600px; height: auto;"/></p><br>
  <p>Dear ${newContactUs.firstName},</p>

  <p>Thank you for reaching out to us!</p>
  <p>We truly appreciate you taking the time to contact us regarding your inquiry. Your message has been received, and we will make sure to address it promptly.</p>

  <p>Our team is dedicated to providing excellent customer service, and we are committed to assisting you with any questions or concerns you may have.</p>

  <p>Rest assured that we have received your message, and a member of our team will get back to you as soon as possible.</p>

  <p>Once again, thank you for choosing First Capitec Local Bank. We look forward to assisting you! </p>

  <p>If you did not request this password reset, please contact us immediately. at <a href="tel:${phoneNumber}">${phoneNumber}</a> or <a href="mailto:${emailAddress}">${emailAddress}</a>. Your satisfaction is important to us, and we are here to assist you</p>

  <p>Warm regards,<br>
  First Capitec Local Bank</p>`;

  const mailOptions = {
    from: config.nodemailerEmail,
    to: newContactUs.email,
    subject: 'Thank You for Contacting First Capitec Local Bank!',
    html: msg,
    attachments: [
      {
        filename: 'logo.png',
        path: './public/images/logo.png',
        cid: 'logo',
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.info('Email sending error:', error);
    } else {
      logger.info('Email sent:', info.response);
    }
  });
};

//update admin inofrmation message
const updateUserProfileMsg = async (user) => {
  const updateProfile = `
    <p><img src="cid:logo" alt="logo" style="width: 100%; max-width: 600px; height: auto;"/></p><br>
  <p>Dear  ${user.firstName} ${user.lastName} ,  We hope this message finds you well. We wanted to inform you that there has been an update to your information in our database. The details that have been modified include:</p>

  <p>Here are some important details to get you started:</p>
  <ul>
      <li>Full Name: ${user.firstName} ${user.lastName}</li>
      <li>Email Address: ${user.email}</li>
      <li>Username: ${user.username}</li>
      <li>Home Address: ${user.address}</li>
      <li>City: ${user.city}</li>
      <li>State: ${user.state}</li>
  </ul>
    
  <p>Please review the changes to ensure that they accurately reflect your information. If you believe any information is incorrect or if you have any questions regarding the update, please don't hesitate to reach out to our administrative team at <a href="tel:${phoneNumber}">${phoneNumber}</a> or <a href="mailto:${emailAddress}">${emailAddress}</a>. Your satisfaction is important to us, and we are here to assist you.</p>

  <p>We value your continued association with us, and it's important to us that your records are kept up-to-date for your convenience and our records.</p>
    
  <p>Best regards,<br>
 First Capitec Local Bank</p>`;

  // Send the second email for verified users
  const mailOptions = {
    from: config.nodemailerEmail,
    to: user.email,
    subject: 'Important Update: Your Information Has Been Modified!',
    html: updateProfile,
    attachments: [
      {
        filename: 'logo.png',
        path: './public/images/logo.png',
        cid: 'logo',
      },
    ],
  };

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      logger.info('Email sending error:', error);
    } else {
      logger.info('Email sent:', info.response);
    }
  });
};

const sendOTPByEmail = async (user, OTP) => {
  const sendingOtp = `
    <p><img src="cid:logo" alt="logo" style="width: 100%; max-width: 600px; height: auto;"/></p><br>
  <p>Dear  ${user.firstName} ${user.lastName} , 

  <p>Your OTP for transaction processing is: ${OTP}</p>

  <p>We value your continued association with us, and it's important to us that your records are kept up-to-date for your convenience and our records.</p>
    
  <p>Best regards,<br>
 First Capitec Local Bank</p>`;

  // Send the second email for verified users
  const mailOptions = {
    from: config.nodemailerEmail,
    to: user.email,
    subject: 'OTP for Transaction Processing',
    html: sendingOtp,
    attachments: [
      {
        filename: 'logo.png',
        path: './public/images/logo.png',
        cid: 'logo',
      },
    ],
  };

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      logger.info('Email sending error:', error);
    } else {
      logger.info('Email sent:', info.response);
    }
  });
};

//update admin inofrmation message
const addBeneficiaryMsg = async (user) => {
  const addBen = `
    <p><img src="cid:logo" alt="logo" style="width: 100%; max-width: 600px; height: auto;"/></p><br>
  <p>Dear  ${user.firstName} ${user.lastName} ,  We hope this message finds you well. We wanted to inform you that you have added newn beneficiary to your account. The details that have been modified include:</p>

  <p>Here are some important details to get you started:</p>
  <ul>
      <li>Full Name: ${user.firstName} ${user.lastName}</li>
      <li>Email Address: ${user.email}</li>
      <li>Username: ${user.username}</li>
      <li>Home Address: ${user.address}</li>
      <li>City: ${user.city}</li>
      <li>State: ${user.state}</li>
  </ul>
    
  <p>Please review the changes to ensure that they accurately reflect your information. If you believe any information is incorrect or if you have any questions regarding the update, please don't hesitate to reach out to our administrative team at <a href="tel:${phoneNumber}">${phoneNumber}</a> or <a href="mailto:${emailAddress}">${emailAddress}</a>. Your satisfaction is important to us, and we are here to assist you.</p>

  <p>We value your continued association with us, and it's important to us that your records are kept up-to-date for your convenience and our records.</p>
    
  <p>Best regards,<br>
 First Capitec Local Bank</p>`;

  // Send the second email for verified users
  const mailOptions = {
    from: config.nodemailerEmail,
    to: user.email,
    subject: 'New beneficiary added',
    html: addBen,
    attachments: [
      {
        filename: 'logo.png',
        path: './public/images/logo.png',
        cid: 'logo',
      },
    ],
  };

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      logger.info('Email sending error:', error);
    } else {
      logger.info('Email sent:', info.response);
    }
  });
};

const sendLoginNotification = async (user) => {
  const newlogin = `
    <p><img src="cid:logo" alt="logo" style="width: 100%; max-width: 600px; height: auto;"/></p><br>
  <p>Hello ${user.firstName},\n\nWe noticed a new login to your account. If this was not you, please contact support immediately.</p>

  <p>We value your continued association with us, and it's important to us that your records are kept up-to-date for your convenience and our records.</p>
    
  <p>Best regards,<br>
 First Capitec Local Bank</p>`;

  // Send the second email for verified users
  const mailOptions = {
    from: config.nodemailerEmail,
    to: user.email,
    subject: 'New Login Detected',
    html: newlogin,
    attachments: [
      {
        filename: 'logo.png',
        path: './public/images/logo.png',
        cid: 'logo',
      },
    ],
  };

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      logger.info('Email sending error:', error);
    } else {
      logger.info('Email sent:', info.response);
    }
  });
};

const forgetPasswordMsg = async (user, resetLink) => {
  const msg = `
  <p><img src="cid:logo" alt="logo" style="width: 100%; max-width: 600px; height: auto;"/></p><br>
  <p>Dear ${user.firstName} ${user.lastName},</p>

  <p>We are writing to confirm your password recovery with Korex StyleHub.</p>
  <p>Reset your password here: <a href="${resetLink}">Click here to reset your password</a></p>

  <p>If you didn't request this verification, please ignore this email.</p>

  <p>If you encounter any issues or need further assistance, feel free to contact our support team at <a href="tel:${phoneNumber}">${phoneNumber}</a> or <a href="mailto:${emailAddress}">${emailAddress}</a>. Your satisfaction is important to us, and we are here to assist you</p>

  <p>Warm regards,<br>
  First Capitec Local Bank</p>`;

  const mailOptions = {
    from: config.nodemailerEmail,
    to: user.email,
    subject: 'Recover your password with EOS Permier Bank!',
    html: msg,
    attachments: [
      {
        filename: 'logo.png',
        path: './public/images/logo.png',
        cid: 'logo',
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.info('Email sending error:', error);
    } else {
      logger.info('Email sent:', info.response);
    }
  });
};

const resetPasswordMsg = async (user) => {
  const msg = `
  <p><img src="cid:logo" alt="logo" style="width: 100%; max-width: 600px; height: auto;"/></p><br>
  <p>Dear ${user.firstName} ${user.lastName},</p>

  <p>We are writing to confirm your password recovery with EOS Bank.</p>
  <p>Your password has been successfully reset. You can now log in to your account using your new password.</p>

  <p>If you did not request this password reset, please contact us immediately. at <a href="tel:${phoneNumber}">${phoneNumber}</a> or <a href="mailto:${emailAddress}">${emailAddress}</a>. Your satisfaction is important to us, and we are here to assist you</p>

  <p>Warm regards,<br>
  EOS Bank</p>
`;

  const mailOptions = {
    from: config.nodemailerEmail,
    to: user.email,
    subject: 'Password Reset Successful!',
    html: msg,
    attachments: [
      {
        filename: 'logo.png',
        path: './public/images/logo.png',
        cid: 'logo',
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.info('Email sending error:', error);
      return res
        .status(500)
        .json({ success: false, errors: [{ msg: 'Error sending email' }] });
    } else {
      logger.info('Email sent:', info.response);
    }
  });
};

const resenderSendOTPByEmail = async (user, otp) => {
  const sendingOtp = `
    <p><img src="cid:logo" alt="logo" style="width: 100%; max-width: 600px; height: auto;"/></p><br>
  <p>Dear  ${user.firstName} ${user.lastName} , 

  <p>Your OTP for transaction processing is: ${otp}</p>

  <p>We value your continued association with us, and it's important to us that your records are kept up-to-date for your convenience and our records.</p>
    
  <p>Best regards,<br>
 First Capitec Local Bank</p>`;

  // Send the second email for verified users
  const mailOptions = {
    from: config.nodemailerEmail,
    to: user.email,
    subject: 'Your OTP Code',
    html: sendingOtp,
    attachments: [
      {
        filename: 'logo.png',
        path: './public/images/logo.png',
        cid: 'logo',
      },
    ],
  };

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      logger.info('Email sending error:', error);
    } else {
      logger.info('Email sent:', info.response);
    }
  });
};

module.exports = {
  contactQueriesMsg,
  updateUserProfileMsg,
  sendOTPByEmail,
  addBeneficiaryMsg,
  sendLoginNotification,
  forgetPasswordMsg,
  resetPasswordMsg,
  resenderSendOTPByEmail,
};
