const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign(
    {
      iss: process.env.TOKEN_ISSUER,
      sub: user.id,
      iat: new Date().getTime(),
      // one day after
      exp: new Date().setDate(new Date().getDate() + 1),
    },
    process.env.TOKEN_SECRET
  );
}

module.exports = {
  generateToken,
};
