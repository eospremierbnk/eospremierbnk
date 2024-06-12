const mongoose = require(`mongoose`);

const adminSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  number: { type: String, required: true },
  password: { type: String, required: true },
  image: [{ imageUrl: String, imageId: String }],
  role: { type: String, default: 'Admin' },
  image: [{ imageUrl: String, imageId: String }],
  date_added: { type: Date, default: Date.now() },
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
