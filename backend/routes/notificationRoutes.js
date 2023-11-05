const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/NotificationController');
const authHandler = require('../middleware/authHandler');
const asyncHandler = require('../middleware/asyncHandler');

// Define your notification routes here

// Create a new notification
router.post('/notifications', notificationsController.createNotification);

// Delete a notification by ID
router.delete('/notifications/:notificationId', notificationsController.deleteNotification);

// Clear all notifications
router.delete('/notifications', authHandler, asyncHandler(notificationsController.clearAllNotifications));

// Batch add notifications
router.post('/batchNotications', authHandler, asyncHandler(notificationsController.batchAddNotifications));

// Mark notification as read
router.put('/notifications/:notificationId/read', notificationsController.markNotificationAsRead);

// Update notification by ID
router.put('/notifications/:notificationId', authHandler, asyncHandler(notificationsController.updateNotification));

// Fetch all notifications
router.get('/notifications', authHandler, asyncHandler(notificationsController.getAllNotifications));

router.put('/notifications',  authHandler, asyncHandler(notificationsController.markAllNotificationsAsRead));


module.exports = router;
