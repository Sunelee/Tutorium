const Thread = require('../models/ThreadModel');


const threadController = {
// Create a new thread
async createThread(req, res) {
  try {
    
    const { title, content, category, tags } = req.body;
    const userId = req.user.id; // Get the user ID from req.user

    const thread = new Thread({
      title,
      content,
      author: userId, // Set the author field to the user ID
      category,
      tags,
    });

    console.log('thread:', thread);

    await thread.save();
    res.status(201).json(thread);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating the thread' });
  }
},


// Get a list of all threads
async getAllThreads(req, res) {
  try {
    const userId = req.user.id;

    // Find threads authored by the user with the specified userId
    const threads = await Thread.find({ author: userId }).populate('category', 'name'); // Only populate the 'category' field

    res.status(200).json(threads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving threads' });
  }
},


// Get details of a specific thread by ID
 async getThreadById (req, res) {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findById(threadId).populate('author category', 'firstName lastName name'); // Populate author and category fields
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }
    res.status(200).json(thread);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving the thread' });
  }
},

// Update a thread by ID
 async updateThread (req, res) {
  const { threadId } = req.params;
  const { title, content} = req.body;
  try {
    const thread = await Thread.findByIdAndUpdate(
      threadId,
      { title, content },
      { new: true }
    ).populate('author category', 'firstName lastName name'); // Populate author and category fields
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }
    res.status(200).json(thread);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating the thread' });
  }
},

// Delete a thread by ID
 async deleteThread (req, res) {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findByIdAndRemove(threadId);
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }
    res.status(204).send(); // No content, successful deletion
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting the thread' });
  }
},


};

module.exports = threadController;