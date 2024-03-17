const { AuthenticationError } = require('apollo-server-express');
const Product = require('../model/product');
const cloudinary = require('cloudinary').v2;

// Resolver to handle getting products
exports.getProducts = async () => {
    // Fetch products from the database (you need to implement this)
    const products = await Product.find();
    return products;
};

// Resolver to handle adding a new product
exports.addProduct = async (_, args, context) => {
    // Check if the user is authenticated
    if (!context.user) {
        throw new AuthenticationError('You must be logged in to add a product.');
    }

    try {
        const { name, price, photos } = args;

        // Upload images to Cloudinary
        const imageArray = [];
        for (let i = 0; i < photos.length; i++) {
            const result = await cloudinary.uploader.upload(photos[i], {
                folder: 'products',
                width: 150,
                crop: "scale"
            });
            imageArray.push({
                id: result.public_id,
                secure_url: result.secure_url
            });
        }

        // Create new product in the database
        const newProduct = await Product.create({
            name,
            price,
            photos: imageArray
        });

        return newProduct;
    } catch (err) {
        throw new Error(err.message);
    }
};
