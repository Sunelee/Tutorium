const Thread = require('../models/ThreadModel'); // Import your Thread model

const CommunityController = {

// Controller for fetching threads
 async fetchThreads (req, res) {
  try {
    const threads = await Thread.find(); // Fetch all threads
    res.status(200).json(threads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
},

// Controller for filtering threads by category
 async filterThreadsByCategory (req, res) {
  const { category } = req.params;

  try {
    const threads = await Thread.find({ category }); // Filter threads by category
    res.status(200).json(threads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
},

// Controller for searching threads by name
async searchThreads(req, res) {
  const { searchQuery } = req.params;
  //const searchQuery= req.searchQuery.searchQuery;

  console.log('searchQuery', searchQuery);

  try {
    const threads = await Thread.find({ title: { $regex: new RegExp(searchQuery, 'i') } });

    console.log('threads', threads);

    res.status(200).json(threads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
},


// Controller for sorting threads
 async sortThreads (req, res) {
  const { sortBy } = req.params;

  try {
    const threads = await Thread.find().sort(sortBy); // Sort threads
    res.status(200).json(threads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
},


};

module.exports = CommunityController;
