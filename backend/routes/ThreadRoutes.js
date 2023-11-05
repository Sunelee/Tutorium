const express = require('express');
const router = express.Router();
const ThreadController = require('../controllers/ThreadController');
const authHandler = require('../middleware/authHandler');
const asyncHandler = require('../middleware/asyncHandler');
// Create a new thread
router.post('/threads', authHandler, asyncHandler(ThreadController.createThread));

// Get a list of all threads
router.get('/threads', authHandler, asyncHandler(ThreadController.getAllThreads));

// Get details of a specific thread by ID
router.get('/threads/:threadId', ThreadController.getThreadById);

// Update a thread by ID
router.put('/threads/:threadId', ThreadController.updateThread);

// Delete a thread by ID
router.delete('/threads/:threadId', ThreadController.deleteThread);

module.exports = router;
