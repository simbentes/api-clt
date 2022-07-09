const express = require("express");
const { body } = require("express-validator");
const { userController } = require("../controllers");
const { validationMiddleware } = require("../middlewares/validationMiddleware");
const authenticatedMiddleware = require("../middlewares/authenticatedMiddleware");
const multer = require("multer");
const crypto = require("crypto");

const router = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./img");
  },
  filename: function (req, file, cb) {
    cb(null, crypto.randomBytes(20).toString("hex") + file.originalname.substring(file.originalname.indexOf(".")));
  },
});
const upload = multer({ storage });

// AUTH
router.get("/auth", userController.auth);

router.post(
  "/register",
  validationMiddleware(
    body("firstName").toLowerCase(),
    body("lastName").isAlpha().toLowerCase(),
    body("email").isEmail().toLowerCase(),
    body("password").notEmpty()
  ),
  userController.register
);

router.post("/login", validationMiddleware(body("email").isEmail().toLowerCase(), body("password").notEmpty()), userController.login);

router
  .route("/")
  .get(authenticatedMiddleware, userController.get)
  .put(authenticatedMiddleware, upload.single("image"), userController.update);

//router.get("/:id", userController.getById);

router.get("/pub", authenticatedMiddleware, userController.getPub);

module.exports = router;
