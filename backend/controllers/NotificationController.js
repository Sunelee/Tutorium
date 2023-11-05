const Notification = require('../models/NotificationModel'); // Assuming you have a Notification model

const notificationsController = {
  async createNotification (req, res) {
    try {
      
      // Create a new notification
      const newNotification = new Notification(req.body);
      const savedNotification = await newNotification.save();
  
      res.status(201).json(savedNotification);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  

 async deleteNotification (req, res) {
  try {
    // Delete a notification by ID
    const deletedNotification = await Notification.findByIdAndDelete(req.params.notificationId);

    if (!deletedNotification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.status(200).json(deletedNotification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

async markNotificationAsRead (req, res) {
  try {

    // Mark a notification as read by ID
    const markedNotification = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { read: true },
      { new: true }
    );

    if (!markedNotification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.status(200).json(markedNotification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

async getAllNotifications(req, res) {
  try {
    const userId = req.user.id; // Get user's ID from the request token
    const notifications = await Notification.find({ recipientId: userId }); // Fetch notifications for the user
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},



async clearAllNotifications(req, res) {
  try {
    const userId = req.user.id;

    // Clear all notifications for the current user
    await Notification.deleteMany({ recipientId: userId });

    res.status(200).json({ message: 'All notifications for the current user cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

async batchAddNotifications(req, res) {
  const userId = req.body.id;

  try {
    const { notificationArray } = req.body;

    // Ensure each notification has the correct recipientId (userId)
    const notificationsWithRecipient = notificationArray.map(notification => ({
      ...notification,
      recipientId: userId,
    }));

    // Batch add notifications with the updated recipientId
    const addedNotifications = await Notification.insertMany(notificationsWithRecipient);

    res.status(201).json(addedNotifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},


async updateNotification(req, res) {
  try {
    const userId = req.user.id;

    // Find the notification by ID and verify that it belongs to the current user
    const updatedNotification = await Notification.findOneAndUpdate(
      {
        _id: req.params.notificationId,
        recipientId: userId,
      },
      req.body,
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ error: 'Notification not found or does not belong to the current user' });
    }

    res.status(200).json(updatedNotification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},


async markAllNotificationsAsRead(req, res) {
  try {
    const userId = req.user.id;

    // Fetch notifications for the current user
    const markedNotifications = await Notification.find({ recipientId: userId });

    // Check if any notifications were found for the current user

    // Mark all notifications as read
    markedNotifications.forEach(notification => {
      notification.read = true;
    });

    // Save the updated notifications
    await Promise.all(markedNotifications.map(notification => notification.save()));

    res.status(200).json(markedNotifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},


};
module.exports = notificationsController;
