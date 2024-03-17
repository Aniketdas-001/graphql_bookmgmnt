const express = require('express');
const router = express.Router();

// Importing Controller
const { signUp, login, forgotPassword, resetPassword, changePassword, updateProfile, userDetails, deleteProfile } = require('../controller/userController');
const { auth, role } = require('../middleware/auth');

// Routes
router.post('/signup', signUp); // Public route for user registration
router.post('/login', login); // Public route for user login
router.post('/forgot-password', forgotPassword); // Public route for password recovery
router.post('/reset-password/:token', resetPassword); // Public route for resetting password with token

// Routes below require authentication
router.use(auth); // Middleware to ensure authentication for the following routes

router.post('/change-password', changePassword); // Route to change user password
router.post('/update-profile', updateProfile); // Route to update user profile
router.get('/delete-profile/:id', role('admin'), deleteProfile); // Route to delete user profile (accessible only to admin)
router.get('/get-users', role('admin', 'manager'), userDetails); // Route to get user details (accessible only to admin and manager)

module.exports = router;
