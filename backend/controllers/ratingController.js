const Rating = require('../models/ratingModel'); // Import your Rating model here
const User = require('../models/UserModel');

const ratingController = {

  async submitTutorRating(req, res) {
    try {
      const { tutorId } = req.params;
      const { rating } = req.body;
      const userId = req.user.id;
  
      // Check if the user is trying to rate themselves
      if (userId.toString() === tutorId.toString()) {
        return res.status(400).json({ error: 'You cannot rate yourself.' });
      }
  
      // Check if the user has already rated this tutor
      const existingRating = await Rating.findOne({ tutor: tutorId, user: userId });
  
      if (existingRating) {
        return res.status(400).json({ error: 'You have already rated this tutor.' });
      }
  
      // Create a new rating
      const newRating = new Rating({
        tutor: tutorId,
        user: userId,
        rating: rating,
      });
  
      await newRating.save();
  
      // Update tutor's ratingSum and ratingCount
      const tutor = await User.findOne({_id: tutorId});
      if (!tutor) {
        return res.status(404).json({ error: 'Tutor not found.' });
      }
  
      tutor.rating.push(newRating); // Add the new rating to the tutor's ratings
      tutor.ratingSum += rating;     // Update the ratingSum
      tutor.ratingCount++;           // Increment the ratingCount
  
      await tutor.save();
  
      res.status(201).json(newRating);
    } catch (error) {
      res.status(500).json({ error: 'Failed to submit tutor rating.' });
    }
  },
  
  
  
  async fetchTutorRatings(req, res) {
    try {
      const { tutorId } = req.params;


      // You can add further authorization checks here if needed

      const ratings = await Rating.find({ tutor: tutorId });

      res.status(200).json(ratings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tutor ratings.' });
    }
  },

  async updateTutorRating(req, res) {
    try {
      const userId = req.user.id;
      const { ratingId } = req.params;
      const { rating } = req.body;

      // Fetch the rating to check ownership
      const existingRating = await Rating.findById(ratingId);

      // Ensure userId matches the user who created the rating
      if (!existingRating || existingRating.user !== userId) {
        return res.status(403).json({ error: 'Unauthorized access.' });
      }

      const updatedRating = await Rating.findByIdAndUpdate(
        ratingId,
        { rating: rating },
        { new: true }
      );

      res.status(200).json(updatedRating);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update tutor rating.' });
    }
  },

  async deleteTutorRating(req, res) {
    try {
      const userId = req.user.id;
      const { ratingId } = req.params;

      // Fetch the rating to check ownership
      const existingRating = await Rating.findById(ratingId);

      // Ensure userId matches the user who created the rating
      if (!existingRating || existingRating.user !== userId) {
        return res.status(403).json({ error: 'Unauthorized access.' });
      }

      await Rating.findByIdAndDelete(ratingId);

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete tutor rating.' });
    }
  },

  async calculateTutorAverageRating(req, res) {
    try {
      const { tutorId } = req.params;

      const ratings = await Rating.find({ tutor: tutorId });
      const totalRatings = ratings.length;
      if (totalRatings === 0) {
        res.status(200).json({ averageRating: 0 });
        return;
      }

      const sumRatings = ratings.reduce((total, rating) => total + rating.rating, 0);
      const averageRating = sumRatings / totalRatings;

      res.status(200).json({ averageRating });
    } catch (error) {
      res.status(500).json({ error: 'Failed to calculate tutor average rating.' });
    }
  },
};

module.exports = ratingController;
