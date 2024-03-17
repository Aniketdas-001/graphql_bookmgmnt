const { AuthenticationError } = require('apollo-server-express');

// Sample resolver to handle the home query in GraphQL
exports.home = async (parent, args, context) => {
    // Check if the user is authenticated
    if (!context.user) {
        throw new AuthenticationError('You must be logged in to access this resource.');
    }
    return { status: 'Hello from GraphQL API!' };
};

// Dummy resolver for another home route (optional)
exports.homeDummy = () => {
    return { status: 'This is another home route from GraphQL API.' };
};
