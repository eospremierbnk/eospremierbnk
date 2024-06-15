const nodemailer = require(`nodemailer`);
const logger = require('../../logger/logger');
const config = require('../../src/configs/customEnvVariables');

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

  <p>Once again, thank you for choosing EOS premier bank. We look forward to assisting you! </p>

  <p>If you did not request this password reset, please contact us immediately. at <a href="tel:${phoneNumber}">${phoneNumber}</a> or <a href="mailto:${emailAddress}">${emailAddress}</a>. Your satisfaction is important to us, and we are here to assist you</p>

  <p>Warm regards,<br>
  EOS premier bank</p>`;

  const mailOptions = {
    from: config.nodemailerEmail,
    to: newContactUs.email,
    subject: 'Thank You for Contacting EOS premier bank!',
    html: msg,
    attachments: [
      {
        filename: 'logo.jpg',
        path: './src/public/images/logo.jpg',
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
 EOS premier bank</p>`;

  // Send the second email for verified users
  const mailOptions = {
    from: config.nodemailerEmail,
    to: user.email,
    subject: 'Important Update: Your Information Has Been Modified!',
    html: updateProfile,
    attachments: [
      {
        filename: 'logo.jpg',
        path: './src/public/images/logo.jpg',
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
 EOS premier bank</p>`;

  // Send the second email for verified users
  const mailOptions = {
    from: config.nodemailerEmail,
    to: user.email,
    subject: 'OTP for Transaction Processing',
    html: sendingOtp,
    attachments: [
      {
        filename: 'logo.jpg',
        path: './src/public/images/logo.jpg',
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

module.exports = { contactQueriesMsg, updateUserProfileMsg, sendOTPByEmail };
