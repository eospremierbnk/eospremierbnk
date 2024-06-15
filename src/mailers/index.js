const {
  contactQueriesMsg,
  updateUserProfileMsg,
  sendOTPByEmail,
} = require('./userMsgMailer');

const {} = require('./adminMsgMailer');

module.exports = { contactQueriesMsg, updateUserProfileMsg, sendOTPByEmail };
