const express = require("express");
const { eventoController } = require("../controllers");
const router = express.Router();

router.get("/", eventoController.getAll);
router.get("/:idEvento", eventoController.getEvento);

module.exports = router;
