const express = require("express");
const { eventoController } = require("../controllers");
const router = express.Router();
const authenticatedMiddleware = require("../middlewares/authenticatedMiddleware");

router.get("/", eventoController.getAll);
router.get("/saved", authenticatedMiddleware, eventoController.getSaved);
router.get("/:idEvento", eventoController.getEvento);
router.get("/:idEvento/action", authenticatedMiddleware, eventoController.action);
router.get("/:idEvento/pub", authenticatedMiddleware, eventoController.getPub);

module.exports = router;
