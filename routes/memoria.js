const express = require("express");
const { memoriaController } = require("../controllers");
const router = express.Router();

router.get("/", memoriaController.getAll);

module.exports = router;
