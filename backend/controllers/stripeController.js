const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Import the Stripe library and use your secret key
const { v4: uuidv4 } = require('uuid'); // Import UUID for generating unique IDs
const Transaction = require('../models/walletModel').Transaction; // Import your Transaction model

// Function to create a payment intent with Stripe
const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id; // Use req.user.id to identify the user

    // Create a unique order ID using UUID
    const orderId = uuidv4();

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe requires the amount in cents
      currency: 'usd', // Replace with your desired currency
      description: `Payment for order ${orderId}`,
      metadata: { userId, orderId }, // Include user and order information as metadata
    });

    // Save the payment intent information in your database or create a transaction record
    // For example, you can create a Transaction model and save the payment intent ID and user ID

    // Sample code for creating a Transaction record:
    const transaction = new Transaction({
      walletId: userId, // Use userId as the walletId
      type: 'debit', // This may vary based on your application logic
      amount,
      description: `Payment for order ${orderId}`,
    });

    await transaction.save();

    // Send the payment intent client secret to the frontend
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createPaymentIntent,
};
