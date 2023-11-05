const jwt = require('jsonwebtoken');
const {
    ForbiddenError,
    UnauthenticatedError,
  } = require('../errors/errors');
  
const User = require('../models/UserModel'); // Your user model

const authHandler = async (req, res, next) => {
    
  try {
    const authHeader = req.headers.authorization;


    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, you can proceed without authentication
      req.user = null; // Set req.user to null for unauthenticated users
      next();
      return;
    }

    const token = authHeader.split(' ')[1];

    
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  
   
    const user = await User.findById(decodedToken.userId);
  

    if (!user) {
      throw new UnauthenticatedError('User not found');
    }

    req.user = user;

    // Check user role (student or tutor) and restrict access accordingly
    if (req.url.includes('/tutor-dashboard') && user.role !== 'tutor') {
      throw new ForbiddenError('Access denied for this role');
    }

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    next(error);
  }
};

module.exports = authHandler;
