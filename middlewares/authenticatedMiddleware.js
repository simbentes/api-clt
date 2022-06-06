const { UnauthorizedError } = require('../utils/errors');

module.exports = async function authenticatedMiddleware(req, res, next) {
  if (!req.user) throw UnauthorizedError();

  next();
};
