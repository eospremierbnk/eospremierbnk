const {
  contactQueriesMsg,
  updateUserProfileMsg,
  sendOTPByEmail,
  addBeneficiaryMsg,
  sendLoginNotification,
  forgetPasswordMsg,
  resetPasswordMsg,
  resenderSendOTPByEmail,
} = require('./userMsgMailer');

const {
  sendAccountStatusUpdateNotification,
  updateAdminProfileMsg,
} = require('./adminMsgMailer');

module.exports = {
  contactQueriesMsg,
  updateUserProfileMsg,
  sendOTPByEmail,
  addBeneficiaryMsg,
  sendLoginNotification,
  sendAccountStatusUpdateNotification,
  updateAdminProfileMsg,
  forgetPasswordMsg,
  resetPasswordMsg,
  resenderSendOTPByEmail,
};
