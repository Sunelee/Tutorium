// src/routes/searchRoutes.js
const express = require('express');
const searchController = require('../controllers/searchController');

const router = express.Router();

// Route to handle search requests
router.get('/search', searchController.search);

// Route to handle suggestions requests
router.get('/suggestions', searchController.fetchSuggestions);

module.exports = router;
