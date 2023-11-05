const Post = require('../models/PostModel');
const Reply = require('../models/RepliesModel');


const postController = {
// Create a new post
async createPost(req, res) {
  const userId = req.user.id; // Get the user ID from req.user
  try {
    const { content, thread } = req.body;

    const post = new Post({
      content,
      author: userId, // Set the author field to the user ID
      thread,
    });

    console.log('post:', post);

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating the post' });
  }
},

// Get a list of all posts in a specific thread
 async getAllPostsInThread (req, res) {
  const { threadId } = req.params;
  try {
    const posts = await Post.find({ thread: threadId }).populate('author', 'firstName lastName'); // Populate author field
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving posts' });
  }
},

// Get details of a specific post by ID
 async getPostById (req, res) {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId).populate('author', 'firstName lastName'); // Populate author field
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving the post' });
  }
},

// Update a post by ID
  async updatePost (req, res) {
  const { postId } = req.params;
  const { content } = req.body;
  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      { content },
      { new: true }
    ).populate('author', 'firstName lastName'); // Populate author field
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating the post' });
  }
},

// Delete a post by ID
  async deletePost (req, res){
  const { postId } = req.params;
  try {
    const post = await Post.findByIdAndRemove(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(204).send(); // No content, successful deletion
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting the post' });
  }
},

async createReply(req, res) {
  const userId = req.user.id; // Get the user ID from req.user
  try {
    const { content, postId } = req.body;

    const reply = new Reply({
      content,
      author: userId, // Set the author field to the user ID
      post: postId, // Set the post field to the post ID
    });

    await reply.save();

    // Update the parent post with the new reply
    const post = await Post.findByIdAndUpdate(
      postId,
      { $push: { replies: reply._id } },
      { new: true }
    );

    res.status(201).json(reply);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating the reply' });
  }
},

// Get replies for a specific post
// Inside getRepliesForPost route
async getRepliesForPost(req, res) {
  const { postId } = req.params; // Get the postId from URL params

  try {
    const replies = await Reply.find({ post: postId })
      .populate('post') // Populate the 'post' field
      .populate('author', 'firstName lastName'); // Populate author field

    res.status(200).json(replies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving replies' });
  }
},

 async likePost (req, res) {
  const { postId } = req.params; // Get the postId from the URL parameter
  const userId = req.user.id; // Assuming you have authentication middleware

  try {
    // Find the post by postId
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the user has already liked the post
    if (post.likes.includes(userId)) {
      return res.status(400).json({ error: 'Post already liked' });
    }

    // Add the user's ID to the post's likes array
    post.likes.push(userId);

    // Save the updated post
    await post.save();

    // You can also populate the author field if needed
    await post.populate('author', 'firstName lastName').execPopulate();

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error liking the post' });
  }
},

// Unlike a post
// Unlike a post
async unlikePost(req, res) {
  const { postId } = req.params; // Get the postId from the URL parameter
  const userId = req.user.id; // Assuming you have authentication middleware


  try {
    // Find the post by postId
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the user has liked the post
    if (!post.likes.includes(userId)) {
      return res.status(400).json({ error: 'Post not liked' });
    }

    // Remove the user's ID from the post's likes array
    const index = post.likes.indexOf(userId);
    if (index !== -1) {
      post.likes.splice(index, 1);
    }


    // Save the updated post
    await post.save();

    // You can also populate the author field if needed
    await post.populate('author', 'firstName lastName').execPopulate();

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error unliking the post' });
  }
},





};

module.exports = postController;