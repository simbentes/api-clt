const express = require("express");
const { pubController } = require("../controllers");
const router = express.Router();
const authenticatedMiddleware = require("../middlewares/authenticatedMiddleware");
const multer = require("multer");
const crypto = require("crypto");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./img");
  },
  filename: function (req, file, cb) {
    cb(null, crypto.randomBytes(20).toString("hex") + file.originalname.substring(file.originalname.indexOf(".")));
  },
});
const upload = multer({ storage });

router.get("/", authenticatedMiddleware, pubController.getAll);
router.get("/:idPub/comments", authenticatedMiddleware, pubController.getComments);
router.get("/:idPub/like", authenticatedMiddleware, pubController.like);

router.post("/", authenticatedMiddleware, upload.single("avatar"), pubController.send);

module.exports = router;
