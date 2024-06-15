const mongoose = require(`mongoose`);
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  number: { type: String, required: true },
  password: { type: String, required: true },
  image: { data: Buffer, contentType: String },
  role: { type: String, default: 'User' },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  accountStatus: { type: String, default: 'Active' },
  savingsAccountNumber: { type: String },
  checkingAccountNumber: { type: String },
  savingAccountType: { type: String, default: 'Business Checkings' },
  checkingAccountType: { type: String, default: 'Business Savings' },
  swiftCode: { type: String, default: 'LNJHFXQA' },
  savingAccountBalance: { type: String },
  checkingAccountBalance: { type: String },
  cardBalance: { type: String },
  cardNumber: { type: String },
  pin: { type: String },
  otp: { type: String },

  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },

  date_added: { type: Date, default: Date.now() },
});

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
