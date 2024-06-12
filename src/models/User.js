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
  accountStatus: { type: String, default: 'Active' },
  accountNumber: { type: String },
  pin: { type: String },

  failedLoginAttempts: { type: Number, default: 0 },
  accountLocked: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },

  date_added: { type: Date, default: Date.now() },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
