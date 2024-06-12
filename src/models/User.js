const mongoose = require(`mongoose`);

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  number: { type: String, required: true },
  password: { type: String, required: true },
  image: [{ imageUrl: String, imageId: String }],
  role: { type: String, default: 'User' },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  accountNumber: { type: String },
  accountType: { type: String },
  accountBalance: { type: Number },
  cardType: { type: String },
  cardBalance: { type: Number },
  accountStatus: { type: String, default: 'Active' },

  pin: { type: String },

  date_added: { type: Date, default: Date.now() },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
