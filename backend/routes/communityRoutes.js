// Import necessary modules and middleware
const express = require('express');
const router = express.Router();
const authHandler = require('../middleware/authHandler');
const asyncHandler = require('../middleware/asyncHandler');
const CommunityController = require('../controllers/communityController');

// Define routes for fetching threads, filtering by category, searching, and sorting
router.get('/allthreads', asyncHandler(CommunityController.fetchThreads)); // Fetch threads
router.get('/threads/category/:category', asyncHandler(CommunityController.filterThreadsByCategory)); // Filter threads by category
router.get('/threads/search/:searchQuery', asyncHandler(CommunityController.searchThreads)); // Search threads
router.get('/threads/sort/:sortBy', asyncHandler(CommunityController.sortThreads)); // Sort threads

module.exports = router;
