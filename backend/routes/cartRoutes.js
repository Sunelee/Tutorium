const express = require('express');
const authHandler = require('../middleware/authHandler');
const asyncHandler = require('../middleware/asyncHandler');
const cartController = require('../controllers/CartController');

const router = express.Router();

router.post('/courses/:courseId', authHandler, asyncHandler(cartController.addToCart));
router.delete('/item/:itemId', cartController.removeFromCart);
router.put('/update-cart-item-quantity', authHandler, asyncHandler(cartController.updateCartItemQuantity));
router.get('/cart', authHandler, asyncHandler(cartController.fetchCartContents));
router.post('/checkout', authHandler, asyncHandler(cartController.checkout));
router.post('/apply-coupon', authHandler, asyncHandler(cartController.applyCoupon));
router.post('/mark-all', authHandler, asyncHandler(cartController.markAllCartItems));
router.post('/unmark-all', authHandler, asyncHandler(cartController.unmarkAllCartItems));
router.delete('/clear-marked', authHandler, asyncHandler(cartController.clearMarkedCartItems));
router.post('/mark-item/:itemId', cartController.markCartItem);
router.post('/unmark-item/:itemId', cartController.unmarkCartItem);

module.exports = router;
