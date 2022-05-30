var express = require("express");
var router = express.Router();

/* GET */
router.get("/", (req, res) => {
  res.status(200).json({ api: "OverTV", msg: "Hello World!" });
});

module.exports = router;
