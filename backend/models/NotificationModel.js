const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This refers to the 'User' model
    required: true,
  },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  unreadNotificationCount: { type: Number, default: 0 },
  marked: {
    type: Boolean,
    default: false, // Initially, items are not marked
  },
  timestamp: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
