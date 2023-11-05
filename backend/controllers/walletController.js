const {Transaction}  = require('../models/TransactionsModel'); // Import the walletModel
const {Wallet} = require('../models/walletModel'); // Import the walletModel
const User = require('../models/UserModel'); // Import the User model
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 
//const stripe = require('stripe')('pk_test_51NrGIFGo3ETpAsO3BQNgBhKWqVZ73bGgvvPssU709l69aEnD5oHOnsG5Nvy7UAbWAUgz9mKByGU3iFtO2FU8kmnW00GjaAtjuN');
// Function to fetch wallet balance
// Controller to fetch a wallet by its ID
const walletController = {

 async fetchWalletById (req, res){
  try {
    // Get the wallet ID from the route parameters
    const { walletId } = req.params;

    // Check if the user is authorized to access this wallet
    const userId = req.user.id; // Assuming you're using Passport.js or similar for authentication

    // Find the wallet by ID and check if the user owns it
    const wallet = await Wallet.findById(walletId);

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // Check if the user owns the wallet
    if (wallet.user.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized access to wallet' });
    }

    // Return the wallet data as JSON response
    res.json(wallet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch wallet by ID' });
  }
},

async createWallet(req, res) {
  try {
    // Get the user's ID from the authenticated user (assuming you have authentication in place)
    const userId = req.user.id;

    // Check if the user already has a wallet
    const existingWallet = await Wallet.findOne({ user: userId });

    if (existingWallet) {
      return res.status(400).json({ error: 'User already has a wallet' });
    }

    // Access walletName, description, and currency directly from req.body
    const { name, description, currency } = req.body;

    // Create a new wallet for the user with the provided data
    const newWallet = new Wallet({
      user: userId,
      balance: 0, // You can set an initial balance if needed
      walletName: name, // Use name from req.body
      description, // Use description from req.body
      currency, // Use currency from req.body
    });

    // Save the new wallet to the database
    await newWallet.save();

    // Update the user's walletId field with the ID of the newly created wallet
    await User.findByIdAndUpdate(userId, { walletId: newWallet._id });

    // Return the created wallet as a JSON response
    res.status(201).json(newWallet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create a wallet' });
  }
}
,

// Function to add funds to the wallet
 // Function to add funds to the wallet
 async addFundsToWallet(req, res) {
  try {
    const { amount } = req.body;
    const userId = req.user.id; // Use req.user.id

    // Fetch the wallet ID based on the user ID
    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // Create a transaction record
    const transaction = new Transaction({
      walletId: wallet._id, // Use the wallet's ID
      type: 'credit',
      amount,
      description: 'Funds added to wallet',
    });

    const createdTransaction = await transaction.save();

    // Update wallet balance and add the transaction ID to the wallet's transactions array
    const updatedWallet = await Wallet.findOneAndUpdate(
      { user: userId }, // Use userId as the walletId
      {
        $inc: { balance: amount }, // Increment the wallet's balance by the specified amount
        $push: { transactions: createdTransaction._id }, // Add the transaction ID to transactions array
      },
      { new: true }
    );

    if (!updatedWallet) {
      return res.status(404).json({ error: 'Wallet not updated' });
    }

    res.json({ message: 'Funds added to wallet', balance: updatedWallet.balance });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
},

async makePayment(req, res) {
  try {
    const { amount, recipient } = req.body;
    const userId = req.user.id; // Use req.user.id

    // Fetch the wallet ID based on the user ID for both sender and recipient
    const senderWallet = await Wallet.findOne({ user: userId });
    const recipientWallet = await Wallet.findOne({ user: recipient });

    if (!senderWallet || !recipientWallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // Create a transaction record for debit using the sender's wallet ID
    const debitTransaction = new Transaction({
      walletId: senderWallet._id, // Use the sender's wallet ID
      type: 'debit',
      amount,
      description: `Payment to ${recipient}`,
    });

    const createdDebitTransaction = await debitTransaction.save();

    // Create a transaction record for credit using the recipient's wallet ID
    const creditTransaction = new Transaction({
      walletId: recipientWallet._id, // Use the recipient's wallet ID
      type: 'credit',
      amount,
      description: `Payment from ${userId}`, // Include sender's userId
    });

    const createdCreditTransaction = await creditTransaction.save();

    // Update sender's wallet balance and add the debit transaction ID to their transactions array
    const updatedSenderWallet = await Wallet.findOneAndUpdate(
      { user: userId }, // Use userId as the walletId
      {
        $inc: { balance: -amount }, // Decrement the sender's wallet balance
        $push: { transactions: createdDebitTransaction._id }, // Add the debit transaction ID
      },
      { new: true }
    );

    if (!updatedSenderWallet) {
      return res.status(404).json({ error: 'Sender wallet not updated' });
    }

    // Update recipient's wallet balance and add the credit transaction ID to their transactions array
    const updatedRecipientWallet = await Wallet.findOneAndUpdate(
      { user: recipient }, // Find the recipient's wallet by userId
      {
        $inc: { balance: amount }, // Increment the recipient's wallet balance
        $push: { transactions: createdCreditTransaction._id }, // Add the credit transaction ID
      },
      { new: true }
    );

    if (!updatedRecipientWallet) {
      return res.status(404).json({ error: 'Recipient wallet not updated' });
    }

    res.json({ message: 'Payment successful', senderBalance: updatedSenderWallet.balance, recipientBalance: updatedRecipientWallet.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
},

async handleCardPayment(req, res) {
  const { paymentMethod, totalAmount } = req.body;

  try {
    // Create a payment intent using Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // Stripe expects the amount in cents
      currency: 'usd', // Modify as needed
      payment_method_types: ['card'],
      payment_method: paymentMethod.id,
      confirm: true,
    });

    // If payment is successful, update the user's wallet balance
    if (paymentIntent.status === 'succeeded') {
      // Implement your logic to update the wallet balance in your database
      const updatedBalance = totalAmount; // Replace with the actual updated balance
      res.json({ message: 'Payment successful', updatedBalance });
    } else {
      // Handle payment failure
      res.status(400).json({ message: 'Payment failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
},

// Function to fetch transaction history
async fetchTransactionHistory(req, res) {
  try {
    const userId = req.user.id; // Use req.user.id

    // Fetch the wallet based on the user ID and populate the transactions
    const wallet = await Wallet.findOne({ user: userId }).populate({
      path: 'transactions',
      match: { type: 'debit' }, // Filter transactions with type 'debit'
    });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    res.json({ transactions: wallet.transactions });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
},


// Function to withdraw funds from the wallet
// Function to withdraw funds from the wallet
async withdrawFundsFromWallet(req, res) {
  try {
    const { amount, paymentMethod } = req.body;
    const userId = req.user.id; // Use req.user.id

    // Fetch the wallet ID based on the user ID
    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // Create a PaymentIntent to confirm the withdrawal
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount in cents
      currency: 'usd', // Change to your currency
      payment_method: paymentMethod,
      confirm: true,
    });

    // Handle paymentIntent confirmation status
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Withdrawal failed' });
    }

    // Create a transaction record for debit using the wallet ID
    const debitTransaction = new Transaction({
      walletId: wallet._id, // Use the wallet's ID
      type: 'debit',
      amount,
      description: 'Funds withdrawn from wallet',
    });

    const createdDebitTransaction = await debitTransaction.save();

    // Update wallet balance and add the debit transaction ID to the wallet's transactions array
    const updatedWallet = await Wallet.findOneAndUpdate(
      { user: userId }, // Use userId as the walletId
      {
        $inc: { balance: -amount }, // Decrement the wallet's balance by the specified amount
        $push: { transactions: createdDebitTransaction._id }, // Add the debit transaction ID to transactions array
      },
      { new: true }
    );

    if (!updatedWallet) {
      return res.status(404).json({ error: 'Wallet not updated' });
    }

    res.json({ message: 'Funds withdrawn from wallet', balance: updatedWallet.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
},


// Function to transfer funds between wallets or users
async transferFunds(req, res) {
  try {
    const { amount, recipientId, walletId } = req.body;
    const userId = req.user.id; // Use req.user.id

    console.log('recipientId', recipientId);
    console.log('amount', amount);

    const senderUser = await User.findById(userId);

    if (!senderUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const senderName = `${senderUser.firstName} ${senderUser.lastName}`;

    const recipientUser = await User.findOne({ walletId: recipientId });

    if (!recipientUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const receiverName = `${recipientUser.firstName} ${recipientUser.lastName}`;

    // Fetch the sender's wallet ID based on their user ID
    const senderWallet = await Wallet.findOne({ user: userId });

    if (!senderWallet) {
      return res.status(404).json({ error: 'Sender wallet not found' });
    }

    // Create a transaction record for debit using sender's wallet ID
    const debitTransaction = new Transaction({
      walletId: walletId, // Use the sender's wallet ID
      type: 'debit',
      amount,
      description: `Funds transferred to ${receiverName}`,
      sender: senderUser._id,
      recipient: recipientUser._id,
    });

    const createdDebitTransaction = await debitTransaction.save();

    const recipientWallet = await Wallet.findById(recipientId);

    if (!recipientWallet) {
      return res.status(404).json({ error: 'Recipient wallet not found' });
    }

    // Create a transaction record for credit to the recipient (using recipient's wallet ID)
    const creditTransaction = new Transaction({
      walletId: recipientId, // Use the recipient's wallet ID
      type: 'credit',
      amount,
      description: `Funds received from ${senderName}`,
      sender: senderUser._id,
      recipient: recipientUser._id,
    });

    const createdCreditTransaction = await creditTransaction.save();

    // Update sender's wallet balance and add the debit transaction ID to their transactions array
    const updatedSenderWallet = await Wallet.findOneAndUpdate(
      { user: userId },
      {
        $inc: { balance: -amount },
        $push: { transactions: createdDebitTransaction._id }, // Push the ID, not the object
      },
      { new: true }
    );

    if (!updatedSenderWallet) {
      return res.status(404).json({ error: 'Sender wallet not updated' });
    }

    // Update recipient's wallet balance and add the credit transaction ID to their transactions array
    const updatedRecipientWallet = await Wallet.findOneAndUpdate(
      { user: recipientUser._id },
      {
        $inc: { balance: amount },
        $push: { transactions: createdCreditTransaction._id }, // Push the ID, not the object
      },
      { new: true }
    );

    if (!updatedRecipientWallet) {
      return res.status(404).json({ error: 'Recipient wallet not updated' });
    }

    res.json({
      message: 'Funds transferred successfully',
      senderBalance: updatedSenderWallet.balance,
      recipientBalance: updatedRecipientWallet.balance,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
},


// Function to fetch earnings
async  fetchEarnings(req, res) {
  try {
    const userId = req.user.id;

    // Fetch the wallet based on the user ID and retrieve received earnings
    const wallet = await Wallet.findOne({ user: userId })

    console.log('wallet', wallet);

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // The 'receivedEarnings' are already filtered by 'credit' type in the query
    // Map each transaction ID to its corresponding data in the Transaction collection
    const receivedEarnings = await Promise.all(wallet.transactions.map(async (transactionId) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        return transaction;
      } catch (error) {
        // Handle any errors that might occur during the fetch
        console.error('Error fetching transaction:', error);
        return null;
      }
    }));

    // Filter out any null values from the receivedEarnings array
    const validReceivedEarnings = receivedEarnings.filter((earning) => earning !== null && earning.type === 'credit');


    console.log('receivedEarnings', validReceivedEarnings);

    res.json({ earnings: validReceivedEarnings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
},

 async fetchTransferIdByUserId (req, res) {
  try {
    // Assuming you have a function to retrieve the transfer ID from the database based on the user ID
    const { userId } = req.body;
    const userWallet = await Wallet.findOne({ user: userId });
    if (!userWallet) {
      throw new Error('User wallet not found.');
    }
    return userWallet.transferId;
  } catch (error) {
    throw error;
  }
},

async createPaymentIntent(req, res) {
  try {
    const { paymentMethod, amount } = req.body;
    const userId = req.user.id; // Assuming you have user authentication and can retrieve the user's ID

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount in cents
      currency: 'usd', // Change to your currency
      payment_method: paymentMethod,
      confirm: true,
    });

    // Handle success and update the wallet balance in your database
    if (paymentIntent.status === 'succeeded') {
      // Update the user's wallet balance with the successful payment
      const wallet = await Wallet.findOne({ user: userId });

      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
      }

      // Create a transaction record for the successful payment
      const transaction = new Transaction({
        walletId: wallet._id,
        type: 'credit', // Assuming it's a credit to the wallet
        amount: amount,
        description: 'Payment received',
      });

      // Update the wallet's balance and add the transaction to the transactions array
      wallet.balance += amount;
      wallet.transactions.push(transaction);

      // Save the updated wallet
      await wallet.save();

      // You can also perform additional actions here, such as sending a confirmation email, etc.

      // Return a success response to the client
      return res.status(200).json({ message: 'Payment succeeded' });
    } else {
      // If the PaymentIntent status is not 'succeeded', handle the error
      return res.status(400).json({ error: 'Payment failed' });
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Payment failed' });
  }
},

async setWalletBalance(req, res) {
  try {
    const userId = req.body.userId; // Get the user ID from the route parameters
    const newBalance = req.body.balance; // Get the new balance value from the request body

    // Update the wallet balance for the user
    const updatedWallet = await Wallet.findOneAndUpdate(
      { user: userId }, // Find the wallet by user ID
      { balance: newBalance },
      { new: true } // Return the updated wallet document
    );

    if (!updatedWallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    res.json({ message: 'Wallet balance updated', wallet: updatedWallet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
},

async makeWalletPayment(req, res) {
  try {
    const { amount, recipientId } = req.body;
    const userId = req.user.id; // Use req.user.id

    console.log('amount, recipientId', amount, recipientId);

    // Get user details for sender
    const senderUser = await User.findById(userId);

    if (!senderUser) {
      return res.status(404).json({ error: 'User not found' });
    } 

    const senderName = `${senderUser.firstName} ${senderUser.lastName}`;

    // Fetch the sender's wallet ID based on their user ID
    const senderWallet = await Wallet.findOne({ user: userId });

    if (!senderWallet) {
      return res.status(404).json({ error: 'Sender wallet not found' });
    }

    // Fetch the tutor's wallet ID based on their user ID
    const recipientUser = await User.findById(recipientId);

    if (!recipientUser) {
      return res.status(404).json({ error: 'Recipient user not found' });
    }

    const recipientWallet = await Wallet.findOne({ user: recipientId });

    if (!recipientWallet) {
      return res.status(404).json({ error: 'Recipient wallet not found' });
    }

    // Create a transaction record for debit using sender's wallet ID
    const debitTransaction = new Transaction({
      walletId: senderWallet._id, // Use the sender's wallet ID
      type: 'debit',
      amount,
      description: `Payment to ${senderName} for course purchased`,
      sender: senderUser._id,
      recipientId: recipientUser._id,
    });

    const createdDebitTransaction = await debitTransaction.save();
    console.log('createdDebitTransaction', createdDebitTransaction);

    // Create a transaction record for credit to the recipient (tutor)
    const creditTransaction = new Transaction({
      walletId: recipientWallet._id, // Use the tutor's wallet ID
      type: 'credit',
      amount,
      description: `Payment from ${senderName} for course purchased`,
      sender: senderUser._id,
      recipientId: recipientUser._id,
    });

    const createdCreditTransaction = await creditTransaction.save();
    console.log('createdCreditTransaction', createdCreditTransaction);

    // Update sender's wallet balance and add the debit transaction ID to their transactions array
    const updatedSenderWallet = await Wallet.findByIdAndUpdate(
      senderWallet._id,
      {
        $inc: { balance: -amount },
        $push: { transactions: createdDebitTransaction._id }, // Add the debit transaction ID
      },
      { new: true }
    );

    if (!updatedSenderWallet) {
      return res.status(404).json({ error: 'Sender wallet not updated' });
    }

    // Update recipient's wallet balance and add the credit transaction ID to their transactions array
    const updatedRecipientWallet = await Wallet.findByIdAndUpdate(
      recipientWallet._id,
      {
        $inc: { balance: amount },
        $push: { transactions: createdCreditTransaction._id }, // Add the credit transaction ID
      },
      { new: true }
    );

    if (!updatedRecipientWallet) {
      return res.status(404).json({ error: 'Recipient wallet not updated' });
    }

    res.json({
      message: 'Payment successful',
      senderBalance: updatedSenderWallet.balance,
      recipientBalance: updatedRecipientWallet.balance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
},


 async checkRecipientExistence (req, res) {
  try {
    // Get the recipientId from the request parameters
    const recipientId = req.params.recipientId;

    // Check if the recipient exists in the Wallet collection
    const recipientExists = await Wallet.exists({ _id: recipientId });

    // Send the response indicating whether the recipient exists
    res.json({ exists: recipientExists });
  } catch (error) {
    // Handle errors here, e.g., send an error response
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
},


  
};

module.exports = walletController;
