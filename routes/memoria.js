const express = require('express');
const { memoriaController } = require('../controllers');
const router = express.Router();
const authenticatedMiddleware = require('../middlewares/authenticatedMiddleware');

router.get('/', memoriaController.getAll);
router.get('/:idEvento', memoriaController.getMemoria);

module.exports = router;
