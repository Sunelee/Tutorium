const Settings = require('../models/settingsModel');
const User = require('../models/UserModel');

// Controller to get user settings
const settingsController = {
  async getSettings(req, res) {
    try {
      const userId = req.user.id;
      const settings = await Settings.findOne({ user: userId });
      if (!settings) {
        return res.status(404).json({ message: 'Settings not found' });
      }
      res.status(200).json(settings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error retrieving settings' });
    }
  },

  // Controller to update notification preferences
  async updateNotifications(req, res) {
    try {
      const updatedSettings = await Settings.findOneAndUpdate(
        { user: req.user.id },
        { notifications: req.body.notifications },
        { new: true }
      );
      res.status(200).json(updatedSettings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating notifications' });
    }
  },

  // Controller to update email preferences
  async updateEmailPreferences(req, res) {
    try {
      const updatedSettings = await Settings.findOneAndUpdate(
        { user: req.user.id },
        { emailPreferences: req.body.emailPreferences },
        { new: true }
      );
      res.status(200).json(updatedSettings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating email preferences' });
    }
  },

  // Controller to update language preferences
  async updateLanguage(req, res) {
    try {
      const updatedSettings = await Settings.findOneAndUpdate(
        { user: req.user.id },
        { language: req.body.language },
        { new: true }
      );
      res.status(200).json(updatedSettings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating language preferences' });
    }
  },

  // Controller to update support and help preferences

  // Controller to delete user account
  async deleteAccount(req, res) {
    try {
      // Ensure authentication and authorization, check if the user is allowed to delete their account
      const userId = req.user.id; // Get the user ID from authentication
      const user = await User.findById(userId); // Assuming you have a User model

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Optionally, you can implement an archive or soft delete approach to retain some data
      // Implement any necessary cleanup actions, like deleting associated posts or courses
      // Delete user data and associated records, use appropriate cascading delete or archive mechanisms

      // Perform the actual account deletion (or archiving)
      await User.findByIdAndDelete(userId); // Delete the user document

      // Optionally, you can send a confirmation email to the user
      // Return a success message upon successful account deletion (or archiving)
      res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting the account' });
    }
  },

  // Controller to manage payment methods
  async managePaymentMethods(req, res) {
    try {
      // Ensure authentication and authorization, check if the user is allowed to manage payment methods
      const userId = req.user.id; // Get the user ID from authentication
      const user = await User.findById(userId); // Assuming you have a User model

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Implement logic to add, remove, or update payment methods
      // Ensure proper validation and security measures for payment method management
      // You may want to use a PaymentMethod model to manage payment methods

      // Example: Adding a new payment method
      const newPaymentMethod = req.body.newPaymentMethod; // Get the new payment method data
      user.paymentMethods.push(newPaymentMethod); // Assuming a paymentMethods array in the User model
      await user.save();

      // Optionally, you can implement logic to remove or update payment methods here

      // Return the updated list of payment methods (or success message)
      res.status(200).json({ message: 'Payment methods updated successfully', paymentMethods: user.paymentMethods });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error managing payment methods' });
    }
  },

  // Controller to update billing address
  async updateBillingAddress(req, res) {
    try {
      const updatedSettings = await Settings.findOneAndUpdate(
        { user: req.user.id },
        { billingAddress: req.body.billingAddress },
        { new: true }
      );
      res.status(200).json(updatedSettings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating billing address' });
    }
  },
};

module.exports = settingsController;
