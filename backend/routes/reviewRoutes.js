const express = require('express');
const reviewsController = require('../controllers/reviewController');
const authHandler = require('../middleware/authHandler');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.post('/courses/:courseId/reviews', authHandler, asyncHandler(reviewsController.submitReview));
router.get('/courses/:courseId/reviews', reviewsController.fetchCourseReviews);
router.patch('/reviews/:reviewId', authHandler, asyncHandler(reviewsController.updateReview));
router.delete('/reviews/:reviewId', authHandler, asyncHandler(reviewsController.deleteReview));
router.post('/reviews/:reviewId/mark', reviewsController.markReviewAsHelpful);
router.post('/fetchReviewsForCourses',  authHandler, asyncHandler(reviewsController.fetchReviewsForCourses));


module.exports = router;
