const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  thread: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thread', // Reference to the Thread model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model (for users who liked the post)
    },
  ],
  replies: [
    {
      content: String,
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model (for users who replied)
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      // You can add more fields to represent reply-specific information
    },
  ],
  // You can add more fields as needed.
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
