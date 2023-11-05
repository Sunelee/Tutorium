const express = require('express');
const filterController = require('../controllers/filterController');

const router = express.Router();

router.post('/filter/data', filterController.filterData);
router.get('/filter/options', filterController.fetchFilterOptions);
router.post('/filter/apply-filters', filterController.applyMultipleFilters);
router.post('/filter/reset-filters', filterController.resetFilters);

module.exports = router;
