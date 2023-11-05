const express = require('express');
const router = express.Router();
const earningsController = require('../controllers/earningsController');
const authHandler = require('../middleware/authHandler');
const asyncHandler = require('../middleware/asyncHandler');

router.get('/history', authHandler, asyncHandler(earningsController.fetchEarningsHistory));
router.get('/summary', authHandler, asyncHandler(earningsController.fetchEarningsSummary));
router.get('/total', authHandler, asyncHandler(earningsController.fetchTotalEarnings));
router.delete('/earningsId', earningsController.deleteEarnings);
router.post('/:courseId/projected', earningsController.calculateProjectedEarnings);

module.exports = router;
