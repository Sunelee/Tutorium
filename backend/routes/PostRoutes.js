const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');
const authHandler = require('../middleware/authHandler');
const asyncHandler = require('../middleware/asyncHandler');

// Create a new post
router.post('/posts', authHandler, asyncHandler(PostController.createPost));

// Get a list of all posts in a specific thread
router.get('/posts/:threadId', PostController.getAllPostsInThread);

// Get details of a specific post by ID
router.get('/posts/:postId', PostController.getPostById);

// Update a post by ID
router.put('/posts/:postId', PostController.updatePost);

// Delete a post by ID
router.delete('/posts/:postId', PostController.deletePost);

// Create a new reply
router.post('/replies', authHandler, asyncHandler(PostController.createReply));

// Get replies for a specific post
router.get('/replies/:postId', PostController.getRepliesForPost);

router.post('/like/:postId', authHandler, asyncHandler(PostController.likePost));

router.delete('/unlike/:postId', authHandler, asyncHandler(PostController.unlikePost));



module.exports = router;
