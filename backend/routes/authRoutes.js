
const express = require('express');
const authController = require('../controllers/authController');
const authHandler = require('../middleware/authHandler');
const asyncHandler = require('../middleware/asyncHandler');
const router = express.Router();
const passport = require('passport')


// Define the authentication routes
router.post('/login', asyncHandler(authController.login));
router.post('/register', authController.register);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/profile',  authHandler, asyncHandler(authController.editUserProfile));
router.patch('/updateAccountDetails',  authHandler, asyncHandler(authController.updateAccountDetails));

router.post('/auth/github', authController.githubLogin);


router.get('/me', authHandler, asyncHandler(authController.fetchUserData));
router.get('/auth/google', passport.authenticate('google', { scope:['https://www.googleapis.com/auth/plus.login'] }));
// Handle the Google OAuth callback
router.get('/auth/google/callback', (req, res, next) => {
    const tokenId = req.query.id_token; // Extracted from the callback URL
    authController.handleGoogleLogin(req, res, next, tokenId); // Pass tokenId to your controller function
  });
  
router.get('/auth/google/secret',passport.authenticate('google',{failureRedirect:'/'}),
(req, res) => {
res.redirect('/')
}
);

router.get('/logout',(req,res) => {
    req.logOut()
    res.redirect('/')
})


module.exports = router;
