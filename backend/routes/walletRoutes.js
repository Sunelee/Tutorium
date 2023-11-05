// walletRoutes.js
const express = require('express');
const router = express.Router();
const authHandler = require('../middleware/authHandler'); // Import authHandler middleware
const asyncHandler = require('../middleware/asyncHandler'); // Import asyncHandler middleware
const walletController = require('../controllers/walletController');
const stripeController = require('../controllers/stripeController'); // Import the controller for Stripe-related operations


router.post('/balance', walletController.setWalletBalance);
router.post('/add-funds', authHandler, asyncHandler(walletController.addFundsToWallet));
router.post('/pay', authHandler, asyncHandler(walletController.makeWalletPayment));
router.post('/make-payment', authHandler, asyncHandler(walletController.makePayment));
router.post('/payment', authHandler, asyncHandler(walletController.handleCardPayment));
router.get('/transactions', authHandler, asyncHandler(walletController.fetchTransactionHistory));
router.post('/withdraw', authHandler, asyncHandler(walletController.withdrawFundsFromWallet));

router.post('/transfer', authHandler, asyncHandler(walletController.transferFunds));

router.get('/earnings', authHandler, asyncHandler(walletController.fetchEarnings));
router.post('/create-payment-intent', authHandler, asyncHandler(walletController.createPaymentIntent));
router.get('/transfer/:userId', walletController.fetchTransferIdByUserId);
router.get('/wallets/:walletId', authHandler, asyncHandler(walletController.fetchWalletById));
router.post('/wallet', authHandler, asyncHandler(walletController.createWallet));
router.get('/check/:recipientId', walletController.checkRecipientExistence);


module.exports = router;
