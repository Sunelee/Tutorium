
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel'); // Assuming UserModel.js is in the same directory
require('dotenv').config(); // Import dotenv to access environment variables
const axios = require('axios');
const { NotFoundError } = require('../errors/errors');
const { OAuth2Client } = require('google-auth-library');

// Initialize the Google OAuth2 client with your Client ID
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function isValidToken(token) {
  const tokenSegments = token.split('.');
  return tokenSegments.length === 3; // Check if there are three segments
}


 // Verify the Google ID token
async function verifyGoogleToken(tokenId) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID, // Verify that the token was issued to your client ID
    });

    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    throw error;
  }
}

const authController = {

  async updateAccountDetails(req, res) {
    try {
      const userId = req.user.id;
      const updatedAccountDetails = req.body;
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      Object.assign(user, updatedAccountDetails);
      await user.save();
  
      res.json({ message: 'Account details updated.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update account details.' });
    }
  },
  
  async editUserProfile (req, res) {
    try {
      const userId = req.user.id;
      const updatedProfile = req.body;
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      Object.assign(user, updatedProfile);
      await user.save();
  
      res.json({ message: 'User profile updated.', updatedUser: user });
    } catch (error) {
      res.status(500).json({ error: 'Failed to edit user profile.' });
    }
  },
  
  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        console.log('User not found');
        return res.status(401).json({ message: 'User not found' });
      }

      const isPasswordMatch = await user.comparePassword(password.trim());

      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Invalid password' });
      } else {
        console.log('Password matches');
      }

      user.numLogins = (user.numLogins || 0) + 1;
      await user.save();

      const token = user.createJWT();
      console.log('Login successful');

      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  async register(req, res) {
    const { firstName, lastName, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const newUser = new User({
        firstName,
        lastName,
        email,
        password,
      });

      await newUser.save();

      const token = newUser.createJWT();

      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  async forgotPassword(req, res) {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });
      // Send reset email using Nodemailer or other email service

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  async githubLogin(req, res) {
    const { code } = req.body;

    try {
      const githubAccessTokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }, {
        headers: {
          Accept: 'application/json',
        },
      });

      const githubAccessToken = githubAccessTokenResponse.data.access_token;

      const githubUserResponse = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${githubAccessToken}`,
        },
      });

      const githubUser = githubUserResponse.data;

      let existingUser = await User.findOne({ email: githubUser.email });

      if (!existingUser) {
        const newUser = new User({
          firstName: githubUser.name,
          email: githubUser.email,
        });

        existingUser = await newUser.save();
      }

      existingUser.numLogins = (existingUser.numLogins || 0) + 1;
      await existingUser.save();

      const token = existingUser.createJWT();

      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  async googleLogin(req, res) {
    const { tokenId } = req.body;
     
    if(!isValidToken(tokenId)){
      return res.status(400).json({message:'Invalid token format'});
    }

    try {
      const googleUser = await verifyGoogleToken(tokenId);

      // Check if the user already exists in your database
      let existingUser = await User.findOne({ email: googleUser.email });

      if (!existingUser) {
        // If the user doesn't exist, create a new user in your database
        const newUser = new User({
          firstName: googleUser.given_name,
          lastName: googleUser.family_name,
          email: googleUser.email,
        });

        existingUser = await newUser.save();
      }

      existingUser.numLogins = (existingUser.numLogins || 0) + 1;
      const token = existingUser.createJWT();

      res.json({ token });
    } catch (error) {
      console.error('Error:', error);

      if (error.response) {
        console.error('Response Status Code:', error.response.status);
        console.error('Response Data:', error.response.data);
      }

      res.status(500).json({ message: 'Server error' });
    }
  },

  async fetchUserData(req, res, next) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
  
 
};



module.exports = authController;
