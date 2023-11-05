const mongoose = require('mongoose');


// Define the Transaction Schema
const transactionSchema = new mongoose.Schema({
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallet', // Reference to the Wallet model
      required: true,
    },
    type: {
      type: String,
      enum: ['credit', 'debit', 'transfer'], // Added 'transfer' type
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now, // Automatically set the current date and time
    },
    // New fields for transfers
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the sender User model
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the recipient User model
    },
  });

  
  const Transaction = mongoose.model('Transaction', transactionSchema);

  module.exports = {
    Transaction,
  };
  