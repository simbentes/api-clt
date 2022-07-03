const express = require("express");
const { memoriaController } = require("../controllers");
const router = express.Router();
const authenticatedMiddleware = require("../middlewares/authenticatedMiddleware");

router.get("/", memoriaController.getAll);
router.get("/:idEvento", memoriaController.getMemoria);

router.get("/:idEvento/pub", authenticatedMiddleware, memoriaController.getPub);

module.exports = router;
