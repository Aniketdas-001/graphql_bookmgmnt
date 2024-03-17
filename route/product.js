const express = require('express');
const router = express.Router();
const { auth, role } = require('../middleware/auth');
const upload = require('../middleware/s3Upload');

// Getting The Controllers
const { getProducts, addProduct } = require('../controller/productController');

// Routes
router.get('/products', getProducts); // Change route to more RESTful endpoint
router.post('/products', auth, role('admin'), upload.any(), addProduct); // Secure add-product route with auth and role middleware

module.exports = router;
