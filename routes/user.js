const express = require("express");
const { body } = require("express-validator");
const { userController } = require("../controllers");
const { validationMiddleware } = require("../middlewares/validationMiddleware");
const authenticatedMiddleware = require("../middlewares/authenticatedMiddleware");

const router = express.Router();

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

router.route("/").get(authenticatedMiddleware, userController.get).put(authenticatedMiddleware, userController.update);

//router.get("/:id", userController.getById);
router.put("/:id", userController.update);

router.get("/pub", authenticatedMiddleware, userController.getPub);

module.exports = router;
