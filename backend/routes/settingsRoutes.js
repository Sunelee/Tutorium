const express = require('express');
const router = express.Router();
const authHandler = require('../middleware/authHandler');
const asyncHandler = require('../middleware/asyncHandler');
const settingsController = require('../controllers/settingsController');

// Define routes for user settings
router.get('/settings',  authHandler, asyncHandler(settingsController.getSettings));
router.patch('/notifications',  authHandler, asyncHandler(settingsController.updateNotifications));
router.patch('/preferences',  authHandler, asyncHandler(settingsController.updateEmailPreferences));
router.patch('/language',  authHandler, asyncHandler(settingsController.updateLanguage));
router.delete('/account',  authHandler, asyncHandler(settingsController.deleteAccount));
router.post('/payment',  authHandler, asyncHandler(settingsController.managePaymentMethods));
router.patch('/billing',  authHandler, asyncHandler(settingsController.updateBillingAddress));

module.exports = router;
