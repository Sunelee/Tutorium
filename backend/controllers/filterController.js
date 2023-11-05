const axios = require('axios');
const API_BASE_URL = 'http://localhost:5000'; // Replace with your API base URL

const createResponse = (res, status, data, errorMessage) => {
  if (status === 200) {
    res.json(data);
  } else {
    res.status(500).json({ error: errorMessage });
  }
};

const filterController = {
  filterData: async (req, res) => {
    try {
      const filterCriteria = req.body; // Assuming filter criteria is in the request body
      const response = await axios.get(`${API_BASE_URL}/data`, {
        params: filterCriteria,
      });
      createResponse(res, response.status, response.data, 'Failed to filter data.');
    } catch (error) {
      res.status(500).json({ error: 'Failed to filter data.' });
    }
  },

  fetchFilterOptions: async (req, res) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/filter-options`);
      createResponse(res, response.status, response.data, 'Failed to fetch filter options.');
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch filter options.' });
    }
  },

  applyMultipleFilters: async (req, res) => {
    try {
      const { filters } = req.body;
      const response = await axios.post(`${API_BASE_URL}/apply-filters`, filters);
      createResponse(res, response.status, response.data, 'Failed to apply filters.');
    } catch (error) {
      res.status(500).json({ error: 'Failed to apply filters.' });
    }
  },

  resetFilters: async (req, res) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/reset-filters`);
      createResponse(res, response.status, response.data, 'Failed to reset filters.');
    } catch (error) {
      res.status(500).json({ error: 'Failed to reset filters.' });
    }
  },
};

module.exports = filterController;
