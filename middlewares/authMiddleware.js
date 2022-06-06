/* eslint-disable operator-linebreak */
const jwt = require('jsonwebtoken');
const { UserModel, RoleModel } = require('../models');

const { UnauthorizedError } = require('../utils/errors');

module.exports = async function authMiddleware(req, res, next) {
  const { authorization } = req.headers;
  if (req.user) next();

  // retirar o token do header do request
  const token =
    authorization &&
    authorization.split(' ')[0] === 'Bearer' &&
    authorization.split(' ')[1];

  if (token) {
    try {
      await jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (e) {
      throw UnauthorizedError();
    }
    const { sub: id, exp } = await jwt.decode(token);

    if (exp > Math.floor(Date.now() / 1000)) {
      const user = await UserModel.findByPk(id, {
        include: [RoleModel],
        attributes: { exclude: ['RoleId', 'password'] },
      });

      if (user) {
        req.user = user;
        next();
      }
    }
  } else {
    next();
  }
};
