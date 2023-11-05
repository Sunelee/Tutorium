const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  notifications: {
    email: {
      courseUpdates: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
    },
    app: {
      courseUpdates: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
    },
  },
  emailPreferences: {
    courseRecommendations: { type: Boolean, default: true },
    updates: { type: Boolean, default: true },
  },
  language: {
    type: String,
    default: 'en', // Default language
  },
  deleteAccount: {
    type: Boolean,
    default: false, // By default, users cannot delete their accounts
  },
  paymentSettings: {
    paymentMethods: [
      {
        type: String, // You can use a more specific schema for payment methods
      },
    ],
    billingAddress: {
      // Define a schema for billing address here
    },
  },
});

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
