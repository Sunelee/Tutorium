const Review = require('../models/ReviewModel'); // Import the Review model
const Course = require('../models/CourseModel'); // Import your CourseModel

const reviewsController = {
  submitReview: async (req, res) => {
    try {
      const userId = req.user.id;
      const { courseId, review, rating } = req.body;
  
      // Validate that courseId, review, and rating are provided
      if (!courseId || !review || rating === undefined || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Invalid data provided for review.' });
      }
  
      const newReview = new Review({
        ReviewerId: userId,
        courseId,
        review,
        rating,
      });
  
      // Save the review
      const savedReview = await newReview.save();
  
      // Update the course's ratingSum and ratingCount
      const course = await Course.findById(courseId);
      course.ratingSum += rating;
      course.ratingCount += 1;
      await course.save();
  
      res.json(savedReview);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to submit review.' });
    }
  },
  

  updateReview: async (req, res) => {
    try {
      const userId = req.user.id;
      const { reviewId } = req.params;
      const { updatedReview } = req.body;
      const updatedReviewDoc = await Review.findOneAndUpdate(
        { _id: reviewId, ReviewerId: userId },
        { review: updatedReview },
        { new: true }
      ).exec();
      res.json(updatedReviewDoc);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update review.' });
    }
  },
  
  

  deleteReview: async (req, res) => {
    try {
      const { reviewId } = req.params;
      const userId = req.user.id;
      const deletedReview = await Review.findOneAndDelete({
        _id: reviewId,
        ReviewerId: userId,
      }).exec();
      res.json(deletedReview);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete review.' });
    }
  },
  
  markReviewAsHelpful: async (req, res) => {
    try {
      const { reviewId } = req.params;
      
      // Find the review by ID and increment the helpfulCount field
      const review = await Review.findByIdAndUpdate(
        reviewId,
        { $inc: { helpfulCount: 1 }, isHelpful: true },
        { new: true }
      ).exec();
  
      res.json(review);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to mark review as helpful.' });
    }
  },
  

  fetchCourseReviews: async (req, res) => {
    try {
      const { courseId } = req.params;
      const reviews = await Review.find({ courseId });
      res.json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch reviews.' });
    }
  },

  fetchReviewsForCourses: async (req, res) => {
    try {
      const { courseIds } = req.body;
      const userId = req.user.id;
  
      // Fetch reviews that match the provided courseIds
      const reviews = await Review.find({ courseId: { $in: courseIds } });
  
      // Fetch courses where the tutor matches the user ID
      const courses = await Course.find({ tutor: userId });
  
      // Extract the course IDs from the matching courses
      const matchingCourseIds = courses.map((course) => course._id);
  
      // Filter the reviews to include only those with matching course IDs
      const filteredReviews = reviews.filter((review) =>
        matchingCourseIds.includes(review.courseId.toString())
      );
  
      res.json(filteredReviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch reviews for courses.' });
    }
  },
  

  // ... (other review-related controller functions)
};

module.exports = reviewsController;
