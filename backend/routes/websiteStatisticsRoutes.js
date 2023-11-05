const express = require('express');
const router = express.Router();
const { fetchWebsiteStatistics } = require('../controllers/websiteStatisticsController');

// Define a route to fetch website statistics
router.get('/statistics', fetchWebsiteStatistics);

module.exports = router;
