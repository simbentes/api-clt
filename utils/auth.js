const jwt = require("jsonwebtoken");

function generateToken(uid) {
  return jwt.sign(
    {
      iss: "2508c139bda7d785430ed42d847e7c497abf072eff88c314dd84d0cfd7248d6b",
      sub: uid,
      iat: new Date().getTime(),
      // one day after
      exp: new Date().setDate(new Date().getDate() + 6),
    },
    "1c10b7ba862f92f28fa01c82b122e52b80565b332702d02a8fb558debb645587053c1ee17d287ffa953bbf3fd337ab81e96f5e1da51e3cd140b41e8eca120658"
  );
}

module.exports = {
  generateToken,
};
