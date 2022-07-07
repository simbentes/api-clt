const jwt = require("jsonwebtoken");

function generateToken(uid) {
  return jwt.sign(
    {
      iss: process.env.TOKEN_ISSUER,
      sub: uid,
      iat: new Date().getTime(),
      // one day after
      exp: new Date().setDate(new Date().getDate() + 6),
    },
    process.env.TOKEN_SECRET
  );
}

module.exports = {
  generateToken,
};
