const axios = require('axios');
const API_BASE_URL = 'http://localhost:5000'; // Replace with your API base URL

const { ForumPost, ForumComment } = require('../models/ForumModel'); // Import your forum models

const forumController = {
  fetchForumPosts: async (req, res) => {
    try {
      const forumPosts = await ForumPost.find();
      res.json(forumPosts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch forum posts.' });
    }
  },

  createForumPost: async (req, res) => {
    try {
      const post = req.body;
      const createdPost = await ForumPost.create(post);
      res.json(createdPost);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create forum post.' });
    }
  },

  updateForumPost: async (req, res) => {
    try {
      const { postId } = req.params;
      const updatedPost = req.body;
      const response = await ForumPost.findByIdAndUpdate(postId, updatedPost, { new: true });
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update forum post.' });
    }
  },

  deleteForumPost: async (req, res) => {
    try {
      const { postId } = req.params;
      await ForumPost.findByIdAndDelete(postId);
      res.json({ message: 'Forum post deleted.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete forum post.' });
    }
  },

  fetchForumPostComments: async (req, res) => {
    try {
      const { postId } = req.params;
      const comments = await ForumComment.find({ post: postId });
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch forum post comments.' });
    }
  },

  addCommentToForumPost: async (req, res) => {
    try {
      const { postId } = req.params;
      const comment = req.body;
      comment.post = postId; // Set the post reference
      const createdComment = await ForumComment.create(comment);
      res.json(createdComment);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add comment to forum post.' });
    }
  },

  updateCommentOnForumPost: async (req, res) => {
    try {
      const { postId, commentId } = req.params;
      const updatedComment = req.body;
      const response = await ForumComment.findByIdAndUpdate(commentId, updatedComment, { new: true });
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update comment on forum post.' });
    }
  },

  deleteCommentOnForumPost: async (req, res) => {
    try {
      const { postId, commentId } = req.params;
      await ForumComment.findByIdAndDelete(commentId);
      res.json({ message: 'Comment deleted.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete comment on forum post.' });
    }
  },

  fetchLeaderboards: async (req, res) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/leaderboards`);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch leaderboards.' });
    }
  },

  addToBookmarks: async (req, res) => {
    try {
      const { postId } = req.body;
      const response = await axios.post(`${API_BASE_URL}/bookmarks`, { postId });
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add post to bookmarks.' });
    }
  },

  fetchCommunityEvents: async (req, res) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/community-events`);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch community events.' });
    }
  },

  fetchBookmarks: async (req, res) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bookmarks`);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch bookmarks.' });
    }
  },
  fetchForumPostById: async (req, res) => {
    try {
      const { postId } = req.params;
      const forumPost = await ForumPost.findById(postId);
      if (!forumPost) {
        return res.status(404).json({ error: 'Forum post not found.' });
      }
      res.json(forumPost);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch forum post.' });
    }
  },

  removeBookmark: async (req, res) => {
    const postId = req.params.postId;

    try {
      const response = await axios.delete(`${API_BASE_URL}/bookmarks/${postId}`);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove post from bookmarks.' });
    }
  },
};



module.exports = forumController;
