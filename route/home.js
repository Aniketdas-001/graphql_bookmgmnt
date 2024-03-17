const express = require('express');
const router = express.Router();

// Importing Controller
const { home } = require('../controller/homeController');
const { auth } = require('../middleware/auth');

// Routes
router.get('/', auth, home); // Secure the home route with authentication middleware

module.exports = router;
