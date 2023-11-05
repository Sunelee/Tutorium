const axios = require('axios');
const API_BASE_URL = 'http://localhost:5000'; // Replace with your API base URL
const Payment = require('../models/paymentModel'); // Import the Payment model

const paymentController = {
  fetchPaymentHistory: async (req, res) => {
    try {
      const { userId } = req.params;
      const payments = await Payment.find({ userId });
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch payment history.' });
    }
  },

  

  updatePayment: async (req, res) => {
    try {
      const { userId, paymentId } = req.params;
      const updatedPaymentInfo = req.body;

      const updatedPayment = await Payment.findByIdAndUpdate(
        paymentId,
        updatedPaymentInfo,
        { new: true }
      ).exec();

      res.json(updatedPayment);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update payment information.' });
    }
  },

  cancelPayment: async (req, res) => {
    try {
      const { userId } = req.params;
      const { paymentId } = req.body;

      const response = await axios.post(
        `${API_BASE_URL}/users/${userId}/cancel-payment`,
        { paymentId }
      );

      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to cancel payment.' });
    }
  },

  makePayment: async (req, res) => {
    try {
      const { userId, paymentMethod, amount } = req.body;

      // Calculate the order amount on the server to prevent manipulation on the client
      const orderAmount = calculateOrderAmount(amount);

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: orderAmount,
        currency: 'usd', // Replace with your desired currency
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Create a new payment document and save it to the database
      const newPayment = new Payment({
        userId,
        paymentDate: new Date(),
        amount: orderAmount / 100, // Convert from cents to dollars (Stripe uses cents)
        paymentMethod,
        status: 'pending', // You can set the initial status as 'pending' or 'processing'.
        stripePaymentIntentId: paymentIntent.id, // Store the PaymentIntent ID for reference
      });

      await newPayment.save();

      res.status(201).json({ success: true, message: 'Payment successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Payment failed' });
    }
  },

  // ... (other payment-related controller functions)
};


const calculateOrderAmount = (amount) => {

  return amount * 100; // Convert amount to cents (Stripe uses cents)
};

module.exports = paymentController;
