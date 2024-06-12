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

const Transaction = mongoose.model('Transaction', transactionSchema);

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = { Transaction, Purchase };
