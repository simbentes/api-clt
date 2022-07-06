const express = require("express");
const { pubController } = require("../controllers");
const router = express.Router();
const authenticatedMiddleware = require("../middlewares/authenticatedMiddleware");

router.get("/", authenticatedMiddleware, pubController.getAll);
router.get("/:idPub/comments", authenticatedMiddleware, pubController.getComments);
router.get("/:idPub/like", authenticatedMiddleware, pubController.like);

module.exports = router;
