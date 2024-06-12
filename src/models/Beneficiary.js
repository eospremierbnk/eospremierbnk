const mongoose = require(`mongoose`);

const beneficiarySchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  number: { type: Number, required: true },
  idNumber: { type: String, required: true },
  accountType: { type: String, required: true },
  relationship: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipcode: { type: String, required: true },
  date_added: { type: Date, default: Date.now() },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Beneficiary = mongoose.model('Beneficiary', beneficiarySchema);

module.exports = Beneficiary;
