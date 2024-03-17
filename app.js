const express = require('express');
const { ApolloServer } = require('apollo-server-express'); // Import Apollo Server
const resolvers = require('./graphql1/resolver'); // Import GraphQL resolvers
const typeDefs = require('./graphql1/schema'); // Import GraphQL schema
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connection = require('./config/db');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

connection();

// Clodinary Configuration
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_APP_KEY,
    api_secret : process.env.CLOUDINARY_APP_SECRET,
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Mount Apollo Server middleware
const apolloServer = new ApolloServer({ typeDefs, resolvers });
apolloServer.applyMiddleware({ app, path: '/graphql' }); // Mount GraphQL middleware on '/graphql' endpoint

// Importing all routes here
const home = require('./route/home');
const user = require('./route/user');
const product = require('./route/product');

// Router Middleware
app.use('/api/v1', home);
app.use('/api/v1', user);
app.use('/api/v1', product);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
