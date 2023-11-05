const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();



router.get('/users/:userId/payment-history', paymentController.fetchPaymentHistory);
router.put('/users/:userId/payments/:paymentId', paymentController.updatePayment);
router.post('/users/:userId/cancel-payment', paymentController.cancelPayment);



module.exports = router;

