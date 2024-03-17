const mongoose = require('mongoose');
const User = require('./user');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title field is required'],
        maxlength: [100, 'Title must be at most 100 characters']
    },
    author: {
        type: String,
        required: [true, 'Author field is required'],
        maxlength: [100, 'Author must be at most 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description field is required']
    },
    category: {
        type: String,
        required: [true, 'Category field is required']
    },
    price: {
        type: Number,
        required: [true, 'Price field is required'],
        min: [0, 'Price cannot be negative']
    },
    stock: {
        type: Number,
        required: [true, 'Stock field is required'],
        min: [0, 'Stock cannot be negative']
    },
    owner: { // Reference to the user who added this product
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    coverImageUrl: { // URL of the book cover image
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);
