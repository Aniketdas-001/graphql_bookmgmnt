const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../model/user');
const jwt = require('jsonwebtoken');

exports.auth = async (context) => {
    const authHeader = context.req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AuthenticationError('Authorization token missing');
    }

    const token = authHeader.split('Bearer ')[1];

    if (!token) {
        throw new AuthenticationError('Authorization token not provided');
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken.id);

        if (!user) {
            throw new AuthenticationError('User not found');
        }

        return user;
    } catch (error) {
        throw new AuthenticationError('Invalid or expired token');
    }
};

exports.role = (...roles) => (next, _, { user }) => {
    if (!user) {
        throw new AuthenticationError('User not authenticated');
    }

    if (!roles.includes(user.role)) {
        throw new AuthenticationError('User does not have the required role for this action');
    }

    return next();
};
