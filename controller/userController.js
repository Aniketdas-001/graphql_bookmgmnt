const { AuthenticationError } = require('apollo-server-express');
const User = require('../model/user');
const cloudinary = require('cloudinary').v2;
const crypto = require('crypto');
const { generateToken } = require('../util/token');

// Resolver to handle user signup
exports.signUp = async (_, args) => {
    try {
        const { name, email, password } = args;

        // Upload user photo to Cloudinary
        const result = await cloudinary.uploader.upload(args.photo, {
            folder: 'users',
            width: 150,
            crop: "scale"
        });

        const user = await User.create({
            name,
            email,
            password,
            photo: {
                id: result.public_id,
                secure_url: result.secure_url
            }
        });

        // Generate JWT token for the user
        const token = generateToken(user._id);

        return { token };
    } catch (err) {
        throw new Error(err.message);
    }
};

// Resolver to handle user login
exports.login = async (_, args) => {
    try {
        const { email, password } = args;

        const user = await User.findOne({ email }).select('password');
        if (!user) {
            throw new AuthenticationError('Invalid email or password');
        }

        const isValidPassword = await user.isValidPassword(password);
        if (!isValidPassword) {
            throw new AuthenticationError('Invalid email or password');
        }

        // Generate JWT token for the user
        const token = generateToken(user._id);

        return { token };
    } catch (err) {
        throw new Error(err.message);
    }
};

// Resolver to handle user profile update
exports.updateProfile = async (_, args, context) => {
    try {
        const { name, email, photo } = args;
        const userId = context.user._id;

        // Update user profile in the database
        const updatedUser = await User.findByIdAndUpdate(userId, {
            name,
            email,
            photo
        }, { new: true });

        return updatedUser;
    } catch (err) {
        throw new Error(err.message);
    }
};

// Resolver to handle user details retrieval
exports.userDetails = async () => {
    try {
        // Fetch all users from the database
        const users = await User.find({ role: "user" });
        return users;
    } catch (err) {
        throw new Error(err.message);
    }
};

// Resolver to handle user deletion
exports.deleteProfile = async (_, args, context) => {
    try {
        const userId = args.id;

        // Check if the user has permission to delete the profile
        if (userId !== context.user._id.toString()) {
            throw new AuthenticationError('You are not authorized to delete this user profile');
        }

        // Delete user profile from the database
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            throw new Error('User not found');
        }

        // Delete user photo from Cloudinary
        await cloudinary.uploader.destroy(deletedUser.photo.id);

        return { success: true, message: 'User profile deleted successfully' };
    } catch (err) {
        throw new Error(err.message);
    }
};
