const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/UserModel'); // Import your User model here

// Middleware to protect routes that require authentication
exports.protect = async (req, res, next) => {
  try {
    // 1. Get the token from the request header
    const token = req.headers.authorization;

    // 2. If no token is provided, return an error
    if (!token) {
      return res.status(401).json({ error: 'Authentication failed: No token provided' });
    }

    // 3. Verify the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 4. Check if the user still exists (optional)
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Authentication failed: User no longer exists' });
    }

    // 5. Attach the user to the request object for further use
    req.user = user;

    // 6. Continue to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed: Invalid token' });
  }
};
