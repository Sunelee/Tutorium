// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authHandler = require('../middleware/authHandler');
const asyncHandler = require('../middleware/asyncHandler');



router.patch('/profile',  authHandler, asyncHandler(userController.editUserProfile));
router.post('/addTutor', userController.addTutor);
router.get('/users/:userId',  authHandler, asyncHandler(userController.fetchProfile));
router.patch('/updateAccountDetails',  authHandler, asyncHandler(userController.updateAccountDetails));
router.get('/users/:userId/statistics', authHandler, asyncHandler(userController.fetchUserStatistics));
router.get('/tutors/:tutorId', userController.fetchTutor);

// Route to fetch student details
router.get('/students/:studentId', userController.fetchStudent);
router.get('/tutors', userController.fetchTutors);

// Route to verify password
router.get('/verifyPassword', authHandler, asyncHandler(userController.verifyPassword));

router.post('/achievements', authHandler, asyncHandler(userController.Achievements));

// Search for tutors
router.get('/search-tutors', userController.searchTutors);

// Filter tutors
router.post('/tutors-filter', userController.filterTutors);


module.exports = router;

