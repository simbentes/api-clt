const jwt = require("jsonwebtoken");

const { UnauthorizedError } = require("../utils/errors");

module.exports = async function authMiddleware(req, res, next) {
  const { authorization } = req.headers;
  if (req.uid) next();

  // retirar o token do header do request
  const token = authorization && authorization.split(" ")[0] === "Bearer" && authorization.split(" ")[1];

  if (token) {
    try {
      await jwt.verify(token, `${process.env.TOKEN_SECRET}`);
    } catch (e) {
      throw UnauthorizedError();
    }
    const { sub: uid, exp } = await jwt.decode(token);

    if (exp > Math.floor(Date.now() / 1000)) {
      if (uid) {
        req.uid = uid;
        next();
      }
    }
  } else {
    next();
  }
};
