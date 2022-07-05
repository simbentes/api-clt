const express = require("express");
const { pubController } = require("../controllers");
const router = express.Router();
const authenticatedMiddleware = require("../middlewares/authenticatedMiddleware");

router.get("/", authenticatedMiddleware, pubController.getAll);
router.get("/:idPub/comments", authenticatedMiddleware, pubController.getComments);

module.exports = router;
