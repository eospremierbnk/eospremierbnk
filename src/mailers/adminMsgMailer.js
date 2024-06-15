const nodemailer = require(`nodemailer`);
const logger = require('../../logger/logger');
const config = require('../../src/configs/customEnvVariables');

const transporter = nodemailer.createTransport({
  service: config.mailerService,
  auth: {
    user: config.nodemailerEmail,
    pass: config.nodemailerPassword,
  },
});

const phoneNumber = config.companyNumber;
const emailAddress = config.companyEmail;

//Register admin
const sendAccountStatusUpdateNotification = async (user) => {
  const verifiedMsg = `
     <p><img src="cid:logo" alt="logo" style="width: 100%; max-width: 600px; height: auto;"/></p><br>
    <p>Hello ${user.firstName},</p><p>Your account status has been updated to: <strong>${user.accountStatus}</strong>. </p>
      
  
      
    <p>Thank you for choosing EOS Premier Bank! Your account has been successfully created, granting you access to our platform's exciting features</p>
      
    <p>Should you have any inquiries or require assistance, please don't hesitate to contact our support team at <a href="tel:${phoneNumber}">${phoneNumber}</a> or <a href="mailto:${emailAddress}">${emailAddress}</a>.Your satisfaction is our priority, and we are committed to providing you with the assistance you need.</p>
      
    <p>Best regards,<br>
   EOS Premier Bank</p>`;

  // Send the second email for verified users
  const mailOptions = {
    from: config.nodemailerEmail,
    to: newAdmin.adminEmail,
    subject: 'Account Status Update',
    html: verifiedMsg,
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

//update admin inofrmation message
const updateAdminProfileMsg = async (admin) => {
  const updateProfile = `
     <p><img src="cid:logo" alt="logo" style="width: 100%; max-width: 600px; height: auto;"/></p><br>
    <p>Dear  ${admin.adminFirstName} ${admin.adminLastName} ,  We hope this message finds you well. We wanted to inform you that there has been an update to your information in our database. The details that have been modified include:</p>

    <p>Here are some important details to get you started:</p>
    <ul>
        <li>Full Name: ${admin.adminFirstName} ${admin.adminLastName}</li>
        <li>Email Address: ${admin.adminEmail}</li>
        <li>Username: ${admin.adminUsername}</li>
        <li>Home Address: ${admin.adminAddress}</li>
        <li>City: ${admin.adminCity}</li>
        <li>State: ${admin.adminState}</li>
    </ul>
      
    <p>Please review the changes to ensure that they accurately reflect your information. If you believe any information is incorrect or if you have any questions regarding the update, please don't hesitate to reach out to our administrative team at <a href="tel:${phoneNumber}">${phoneNumber}</a> or <a href="mailto:${emailAddress}">${emailAddress}</a>. Your satisfaction is important to us, and we are here to assist you.</p>

    <p>We value your continued association with us, and it's important to us that your records are kept up-to-date for your convenience and our records.</p>
      
    <p>Best regards,<br>
    The Korex StyleHub Team</p>`;

  // Send the second email for verified users
  const mailOptions = {
    from: config.nodemailerEmail,
    to: admin.adminEmail,
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

module.exports = { updateAdminProfileMsg, sendAccountStatusUpdateNotification };
