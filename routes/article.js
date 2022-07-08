const express = require("express");
const { articleController } = require("../controllers");
const router = express.Router();
const authenticatedMiddleware = require("../middlewares/authenticatedMiddleware");

router.get("/", authenticatedMiddleware, articleController.getAll);

module.exports = router;
