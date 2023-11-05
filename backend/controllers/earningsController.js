
const Transaction = require('../models/walletModel'); // Import your earningsModel here

const createResponse = (res, status, data, errorMessage) => {
  if (status === 200) {
    res.json(data);
  } else {
    res.status(500).json({ error: errorMessage });
  }
};

const earningsController = {
  fetchEarningsHistory: async (req, res) => {
    try {
      const { userId } = req.params;
      const response = await axios.get(`${API_BASE_URL}/users/${userId}/earnings/history`);
      createResponse(res, response.status, response.data, 'Failed to fetch earnings history.');
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch earnings history.' });
    }
  },

  fetchEarningsSummary: async (req, res) => {
    try {
      const { userId } = req.params;
      const response = await axios.get(`${API_BASE_URL}/users/${userId}/earnings/summary`);
      createResponse(res, response.status, response.data, 'Failed to fetch earnings summary.');
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch earnings summary.' });
    }
  },

  fetchTotalEarnings: async (req, res) => {
    try {
      const { userId } = req.params;
      const response = await axios.get(`${API_BASE_URL}/users/${userId}/earnings/total`);
      createResponse(res, response.status, response.data, 'Failed to fetch total earnings.');
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch total earnings.' });
    }
  },

  deleteEarnings: async (req, res) => {
    try {
      const { userId, earningsId } = req.params;
      const response = await earningsModel.deleteEarnings(userId, earningsId);
      createResponse(res, response.status, response.data, 'Failed to delete earnings.');
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete earnings.' });
    }
  },

  calculateProjectedEarnings: async (req, res) => {
    try {
      const { courseId } = req.params;
      const { monthlyEnrollments } = req.body;
      const response = await axios.post(
        `${API_BASE_URL}/courses/${courseId}/projected-earnings`,
        { monthlyEnrollments }
      );
      createResponse(res, response.status, response.data, 'Failed to calculate projected earnings.');
    } catch (error) {
      res.status(500).json({ error: 'Failed to calculate projected earnings.' });
    }
  },
};

module.exports = earningsController;
