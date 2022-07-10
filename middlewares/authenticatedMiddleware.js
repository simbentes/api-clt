const { UnauthorizedError } = require("../utils/errors");

module.exports = async function authenticatedMiddleware(req, res, next) {
  if (!req.uid) throw UnauthorizedError();

  next();
};

//helo
