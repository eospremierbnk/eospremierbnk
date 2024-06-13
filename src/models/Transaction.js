const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  amount: { type: String },
  type: { type: String },
  description: { type: String },
  paidIn: { type: Number },
  paidOut: { type: Number },
  date_added: { type: Date, default: Date.now() },
});

const purchaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  store: { type: String },
  card: { type: String },
  amount: { type: String },
  date_added: { type: Date, default: Date.now() },
});

const userAccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  savingsAccountNumber: { type: Number },
  checkingAccountNumber: { type: Number },
  accountType: { type: String },
  internalRefnternalRef: { type: String },
  swiftCode: { type: String },
  accountBalance: { type: Number },
  cardType: { type: String },
  cardBalance: { type: Number },
  cardNumber: { type: Number },
  accountStatus: { type: String, default: 'Active' },
  pin: { type: Number },
  date_added: { type: Date, default: Date.now() },
});

const Transaction = mongoose.model('Transaction', transactionSchema);
const Purchase = mongoose.model('Purchase', purchaseSchema);
const UserAccount = mongoose.model('UserAccount', userAccountSchema);

module.exports = { Transaction, Purchase, UserAccount };
// accountNumber
// 6587690876
// swiftCode
// "LCPBNXQA"
// accountBalance
// "424,571.93"
// accountType
// "Checking"
// cardBalance
// "24,171.43"
// cardNumber
// 4356
// cardType
// "Visa"
// pin
// 9090
