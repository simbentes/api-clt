const express = require("express");
const { commentController } = require("../controllers");
const router = express.Router();
const authenticatedMiddleware = require("../middlewares/authenticatedMiddleware");

router.get("/:idComment/like", authenticatedMiddleware, commentController.like);

module.exports = router;
