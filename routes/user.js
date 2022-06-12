const express = require("express");
const { body } = require("express-validator");
const { userController } = require("../controllers");
const { validationMiddleware } = require("../middlewares/validationMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: users
 *   description: user management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     user:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The user ID.
 *           example: 1
 *         firstName:
 *           type: string
 *           description: The user's first name.
 *           example: John
 *         lastName:
 *           type: string
 *           description: The user's last name.
 *           example: Doe
 */

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

// Follow
router.post("/:id/follow", userController.follow);
router.post("/:id/unfollow", userController.unfollow);
router.get("/:id/followers", userController.getFollowers);
router.get("/:id/followees", userController.getFollowees);

// CRUD

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [users]
 *     summary: List all users
 *     description: Retrieve a list of users.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/user'
 */
router.get("/", userController.getAll);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [users]
 *     summary: Get a single user
 *     description: Retrieve a user by id;
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/user'
 *
 */
router.get("/:id", userController.getById);
router.put("/:id", userController.update);
router.delete("/:id", userController.destroy);

module.exports = router;
