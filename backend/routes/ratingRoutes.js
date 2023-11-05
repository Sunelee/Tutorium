const express = require('express');
const router = express.Router();

const ratingController = require('../controllers/ratingController');
const authHandler = require('../middleware/authHandler');
const asyncHandler = require('../middleware/asyncHandler');

router.post('/tutors/:tutorId/ratings', authHandler, asyncHandler(ratingController.submitTutorRating));
router.get('/tutors/:tutorId/ratings', ratingController.fetchTutorRatings);
router.patch('/tutors/:tutorId/ratings/:ratingId', authHandler, asyncHandler(ratingController.updateTutorRating));
router.delete('/tutors/:tutorId/ratings/:ratingId', authHandler, asyncHandler(ratingController.deleteTutorRating));
router.get('/tutors/:tutorId/ratings/average', ratingController.calculateTutorAverageRating);

module.exports = router;
