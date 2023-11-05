const express = require('express');
const router = express.Router();
const {fetchUserProfile,updateUserProfile} = require('../controllers/editProfileController'); // Replace with the actual path to the editProfileController file

// Middleware to verify user authentication (assuming you have this middleware defined)
const authMiddleware = require('../middleware/authMiddleware');

// Route to fetch user profile (protected route, requires authentication)
router.get('/user-profile', fetchUserProfile);

// Route to update user profile (protected route, requires authentication)
router.put('/update-user-profile', updateUserProfile);

module.exports = router;
