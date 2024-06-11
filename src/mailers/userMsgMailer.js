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

module.exports = { contactQueriesMsg };
