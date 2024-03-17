const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username field is required'],
        unique: true,
        maxlength: [30, 'Username must be at most 30 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email field is required'],
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password field is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        select: false // Password should not be returned in query results
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Added admin role
        default: 'user'
    },
    photo: {
        type: String // Assuming you store the URL of the user's profile picture
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // Add other fields as needed
});

// Encrypt password before saving user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// Validate the password with user's given password
userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generate JWT token for authentication
userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    });
};

// Generate and hash password reset token
userSchema.methods.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes
    return resetToken;
};

module.exports = mongoose.model('User', userSchema);
