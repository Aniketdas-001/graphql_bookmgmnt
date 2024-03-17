const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql1/schema');
const resolver = require('./graphql1/resolver');
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

// Create an instance of ApolloServer
const apolloServer = new ApolloServer({ typeDefs, resolver });

// Await the start of the Apollo Server before applying middleware
async function startApolloServer() {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql1' });
}

startApolloServer().then(() => {
  // Start the Express server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
