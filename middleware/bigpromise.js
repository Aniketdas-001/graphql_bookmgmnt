// errorHandler.js

module.exports = errorHandler = func => (req, res, next) =>
    Promise.resolve(func(req, res, next)).catch(next);
