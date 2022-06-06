const { error } = require('../utils/apiResponse');

async function adminMiddleware(req, res, next) {
  if (!req.user || !req.user.Role.name !== 'admin') next();

  res.status(401).send(error('Unauthorized', 401));

  next();
}

module.exports = [adminMiddleware];
