const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  message: { type: String },
  date_added: { type: Date, default: Date.now() },
});

const UserMessage = mongoose.model('UserMessage', messageSchema);

module.exports = UserMessage;
