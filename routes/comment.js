const express = require('express');

const router = express.Router();
const authenticatedMiddleware = require('../middlewares/authenticatedMiddleware');

const { commentController } = require('../controllers');

router.get('/:idComment/like', authenticatedMiddleware, commentController.like);
router.post('/:idPub', authenticatedMiddleware, commentController.send);

router.delete('/:idComment', authenticatedMiddleware, commentController.eliminar);

module.exports = router;
