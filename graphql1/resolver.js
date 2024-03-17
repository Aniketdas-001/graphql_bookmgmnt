const { Product, User } = require('./schema'); // Import your data models

const resolvers = {
  Query: {
    products: () => Product.find(), // Example: Fetch all products from your database
    product: (_, { id }) => Product.findById(id), // Example: Fetch a product by ID
    users: () => User.find(), // Example: Fetch all users from your database
    user: (_, { id }) => User.findById(id), // Example: Fetch a user by ID
    // Add other query resolvers as needed
  },
  Mutation: {
    addProduct: (_, { name, price }) => {
      const newProduct = new Product({ name, price });
      return newProduct.save();
    },
    updateProduct: (_, { id, name, price }) => {
      return Product.findByIdAndUpdate(id, { name, price }, { new: true });
    },
    deleteProduct: (_, { id }) => {
      return Product.findByIdAndDelete(id);
    },
    // Add other mutation resolvers as needed
  },
};

module.exports = resolvers;
