const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    price: Float!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    # Add other user fields as needed
  }

  type Query {
    products: [Product]!
    product(id: ID!): Product
    users: [User]!
    user(id: ID!): User
    # Define other queries as needed
  }

  type Mutation {
    addProduct(name: String!, price: Float!): Product!
    updateProduct(id: ID!, name: String, price: Float): Product
    deleteProduct(id: ID!): Product
    # Define other mutations as needed
  }
`;

module.exports = typeDefs;
