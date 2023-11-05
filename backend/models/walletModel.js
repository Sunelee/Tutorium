const mongoose = require('mongoose');

// Define the Wallet Schema
const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0, // Starting balance
  },
  walletName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  currency: {
    type: String,
    required: true,
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction', // Reference to the Transaction model
    },
  ],
});

const Wallet = mongoose.model('Wallet', walletSchema);


module.exports = {
  Wallet,
};
