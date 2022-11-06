const express = require('express');
const { commentController } = require('../controllers');
const router = express.Router();
const authenticatedMiddleware = require('../middlewares/authenticatedMiddleware');

router.get('/:idComment/like', authenticatedMiddleware, commentController.like);
router.post('/:idPub', authenticatedMiddleware, commentController.send);

router.delete('/:idComment', authenticatedMiddleware, commentController.eliminar);

module.exports = router;
