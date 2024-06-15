const {
  contactQueriesMsg,
  updateUserProfileMsg,
  sendOTPByEmail,
  addBeneficiaryMsg,
  sendLoginNotification,
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
};
